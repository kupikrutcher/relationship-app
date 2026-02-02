import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Railway: добавьте Volume с mount path /data — RAILWAY_VOLUME_MOUNT_PATH установится автоматически
// Локально: data.json в корне проекта
const DATA_FILE =
  process.env.DATA_FILE_PATH ||
  (process.env.RAILWAY_VOLUME_MOUNT_PATH
    ? path.join(process.env.RAILWAY_VOLUME_MOUNT_PATH, 'data.json')
    : path.join(process.cwd(), 'data.json'));

const defaultState = {
  events: [],
  wishes: [],
  reminders: [],
  moodEntries: [],
  settings: {
    isPremium: false,
    partnerName: 'Партнер',
    significanceFormula: {
      costWeight: 0.3,
      romanticismWeight: 0.5,
      scaleWeight: 0.2,
    },
  },
};

// Формат Zustand persist: { state, version }
const persistFormat = (state: typeof defaultState) => ({
  state,
  version: 0,
});

export async function GET() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    // Поддержка обоих форматов: persist { state, version } или плоский
    const state = parsed.state ?? parsed;
    return NextResponse.json(persistFormat(state));
  } catch {
    return NextResponse.json(persistFormat(defaultState));
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const state = body.state ?? body;
    const data = persistFormat({
      events: state.events ?? [],
      wishes: state.wishes ?? [],
      reminders: state.reminders ?? [],
      moodEntries: state.moodEntries ?? [],
      settings: {
        ...defaultState.settings,
        ...state.settings,
        significanceFormula: state.settings?.significanceFormula ?? defaultState.settings.significanceFormula,
      },
    });
    const dir = path.dirname(DATA_FILE);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}
