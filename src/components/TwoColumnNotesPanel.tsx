import { useLanguage } from '../i18n/LanguageContext';
import type { ScoutNote } from '../types/scoutNotes';

interface TwoColumnNotesPanelProps {
  hint: string;
  leftTitle: string;
  rightTitle: string;
  leftEmpty: string;
  rightEmpty: string;
  leftNotes: ScoutNote[];
  rightNotes: ScoutNote[];
}

function NotesColumn({
  title,
  empty,
  notes,
}: {
  title: string;
  empty: string;
  notes: ScoutNote[];
}) {
  const { L } = useLanguage();
  return (
    <div className="notes-column">
      <h3 className="notes-column-title">{title}</h3>
      {notes.length === 0 ? (
        <p className="home-empty">{empty}</p>
      ) : (
        <ul className="notes-column-list">
          {notes.map((note) => (
            <li key={note.id}>{L(note.text)}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function TwoColumnNotesPanel({
  hint,
  leftTitle,
  rightTitle,
  leftEmpty,
  rightEmpty,
  leftNotes,
  rightNotes,
}: TwoColumnNotesPanelProps) {
  return (
    <div className="two-column-notes">
      <p className="video-hint">{hint}</p>
      <div className="notes-columns">
        <NotesColumn title={leftTitle} empty={leftEmpty} notes={leftNotes} />
        <NotesColumn title={rightTitle} empty={rightEmpty} notes={rightNotes} />
      </div>
    </div>
  );
}
