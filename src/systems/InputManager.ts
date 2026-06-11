/**
 * Unified input: remappable keyboard, gamepad, and on-screen touch controls
 * all feed one action-state object polled by gameplay code each frame.
 */
import Phaser from 'phaser';
import { saves, KeyBindings } from './SaveSystem';

export type Action = keyof KeyBindings;

interface ActionState {
  down: boolean;
  justDown: boolean;
}

/** Touch overlay writes into this; survives scene restarts. */
export const virtualPad = {
  left: false,
  right: false,
  up: false,
  down: false,
  jump: false,
  run: false,
  pause: false
};

export class InputManager {
  private keys = new Map<Action, Phaser.Input.Keyboard.Key>();
  private state: Record<Action, ActionState> = {
    left: { down: false, justDown: false },
    right: { down: false, justDown: false },
    up: { down: false, justDown: false },
    down: { down: false, justDown: false },
    jump: { down: false, justDown: false },
    run: { down: false, justDown: false },
    pause: { down: false, justDown: false }
  };
  private prevDown: Record<Action, boolean> = {
    left: false, right: false, up: false, down: false,
    jump: false, run: false, pause: false
  };

  constructor(private scene: Phaser.Scene) {
    this.bindKeys();
  }

  /** (Re)bind keyboard keys from saved bindings — called after remapping. */
  bindKeys(): void {
    const kb = this.scene.input.keyboard;
    if (!kb) return;
    for (const key of this.keys.values()) key.destroy();
    this.keys.clear();
    const bindings = saves.get().settings.bindings;
    for (const action of Object.keys(bindings) as Action[]) {
      const code = domCodeToPhaser(bindings[action]);
      if (code !== null) this.keys.set(action, kb.addKey(code, false));
    }
  }

  /** Poll once per frame before any gameplay logic reads input. */
  update(): void {
    const pad = this.firstPad();
    for (const action of Object.keys(this.state) as Action[]) {
      const key = this.keys.get(action);
      let down = (key?.isDown ?? false) || virtualPad[action];
      if (pad) down = down || padAction(pad, action);
      this.state[action].justDown = down && !this.prevDown[action];
      this.state[action].down = down;
      this.prevDown[action] = down;
    }
  }

  isDown(action: Action): boolean {
    return this.state[action].down;
  }

  justDown(action: Action): boolean {
    return this.state[action].justDown;
  }

  private firstPad(): Phaser.Input.Gamepad.Gamepad | null {
    const gp = this.scene.input.gamepad;
    if (!gp || gp.total === 0) return null;
    return gp.getPad(0) ?? null;
  }

  destroy(): void {
    for (const key of this.keys.values()) key.destroy();
    this.keys.clear();
  }
}

function padAction(pad: Phaser.Input.Gamepad.Gamepad, action: Action): boolean {
  const stickX = pad.axes.length > 0 ? pad.axes[0].getValue() : 0;
  const stickY = pad.axes.length > 1 ? pad.axes[1].getValue() : 0;
  switch (action) {
    case 'left': return pad.left || stickX < -0.4;
    case 'right': return pad.right || stickX > 0.4;
    case 'up': return pad.up || stickY < -0.5;
    case 'down': return pad.down || stickY > 0.5;
    case 'jump': return pad.A || pad.B;
    case 'run': return pad.X || pad.Y || pad.R1 > 0.5 || pad.L1 > 0.5;
    case 'pause': return pad.buttons.length > 9 ? pad.buttons[9].pressed : false;
  }
}

/**
 * Map DOM KeyboardEvent.code strings (stored in the save file) to Phaser
 * keycodes. Covers letters, digits, arrows, and common special keys.
 */
export function domCodeToPhaser(code: string): number | null {
  const KC = Phaser.Input.Keyboard.KeyCodes;
  if (/^Key[A-Z]$/.test(code)) return KC.A + (code.charCodeAt(3) - 65);
  if (/^Digit\d$/.test(code)) return KC.ZERO + (code.charCodeAt(5) - 48);
  const table: Record<string, number> = {
    ArrowLeft: KC.LEFT,
    ArrowRight: KC.RIGHT,
    ArrowUp: KC.UP,
    ArrowDown: KC.DOWN,
    Space: KC.SPACE,
    Enter: KC.ENTER,
    ShiftLeft: KC.SHIFT,
    ShiftRight: KC.SHIFT,
    ControlLeft: KC.CTRL,
    ControlRight: KC.CTRL,
    AltLeft: KC.ALT,
    Escape: KC.ESC,
    Tab: KC.TAB,
    Comma: KC.COMMA,
    Period: KC.PERIOD,
    Slash: KC.FORWARD_SLASH,
    Semicolon: KC.SEMICOLON,
    Quote: KC.QUOTES,
    BracketLeft: KC.OPEN_BRACKET,
    BracketRight: KC.CLOSED_BRACKET,
    Backspace: KC.BACKSPACE
  };
  return table[code] ?? null;
}

/** Human-readable label for a DOM code, for the settings menu. */
export function codeLabel(code: string): string {
  if (/^Key[A-Z]$/.test(code)) return code.slice(3);
  if (/^Digit\d$/.test(code)) return code.slice(5);
  const labels: Record<string, string> = {
    ArrowLeft: 'LEFT',
    ArrowRight: 'RIGHT',
    ArrowUp: 'UP',
    ArrowDown: 'DOWN',
    Space: 'SPACE',
    Enter: 'ENTER',
    ShiftLeft: 'SHIFT',
    ShiftRight: 'RSHIFT',
    ControlLeft: 'CTRL',
    Escape: 'ESC'
  };
  return labels[code] ?? code.toUpperCase();
}
