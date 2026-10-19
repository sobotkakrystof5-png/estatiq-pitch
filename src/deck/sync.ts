import { useCallback, useEffect, useRef, type MutableRefObject } from 'react';
import type { NavAction } from './useDeck';
import type { Position } from './types';

export type LinkRole = 'stage' | 'presenter';
export type LinkPayload =
  | { kind: 'hello' }
  | { kind: 'state'; position: Position; timerStartedAt: number | null }
  | { kind: 'navigate'; action: NavAction }
  | { kind: 'timer'; startedAt: number };

export type LinkMessage = LinkPayload & { from: LinkRole; id: string };
type PeerRef = MutableRefObject<Window | null>;

const CHANNEL = 'estatiq-pitch-presenter';
const isMessage = (value: unknown): value is LinkMessage => {
  if (!value || typeof value !== 'object') return false;
  const msg = value as Partial<LinkMessage>;
  return (
    (msg.from === 'stage' || msg.from === 'presenter') &&
    typeof msg.id === 'string' &&
    typeof msg.kind === 'string'
  );
};

/** BroadcastChannel is the primary path. The opener bridge is mirrored as a fallback
 * because file:// pages can construct a channel that never delivers across windows. */
export function usePresenterLink(
  role: LinkRole,
  peerRef: PeerRef,
  onMessage: (message: LinkMessage) => void,
) {
  const callbackRef = useRef(onMessage);
  const channelRef = useRef<BroadcastChannel | null>(null);
  const seenRef = useRef(new Set<string>());

  useEffect(() => {
    callbackRef.current = onMessage;
  }, [onMessage]);

  const send = useCallback(
    (payload: LinkPayload) => {
      const message: LinkMessage = {
        ...payload,
        from: role,
        id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      };
      try {
        channelRef.current?.postMessage(message);
      } catch {
        // The opener bridge below handles browsers that reject BroadcastChannel posts.
      }
      try {
        peerRef.current?.postMessage(message, '*');
      } catch {
        // The channel remains available when the popup bridge is unavailable.
      }
      return message.id;
    },
    [peerRef, role],
  );

  useEffect(() => {
    const receive = (value: unknown) => {
      if (!isMessage(value) || value.from === role || seenRef.current.has(value.id)) return;
      seenRef.current.add(value.id);
      if (seenRef.current.size > 200) seenRef.current.clear();
      callbackRef.current(value);
    };
    const onWindowMessage = (event: MessageEvent) => {
      if (event.source !== peerRef.current) return;
      receive(event.data);
    };
    window.addEventListener('message', onWindowMessage);
    try {
      if ('BroadcastChannel' in window) {
        const channel = new BroadcastChannel(CHANNEL);
        channelRef.current = channel;
        channel.onmessage = (event: MessageEvent<unknown>) => receive(event.data);
      }
    } catch {
      channelRef.current = null;
    }
    if (role === 'presenter') send({ kind: 'hello' });
    return () => {
      window.removeEventListener('message', onWindowMessage);
      channelRef.current?.close();
      channelRef.current = null;
    };
  }, [peerRef, role, send]);

  return send;
}
