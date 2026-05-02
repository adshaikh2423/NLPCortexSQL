import { useEffect, useState, useRef } from 'react';
import './TypewriterCode.css';

const SQL_LINES = [
  'SELECT p.name, SUM(o.amount) AS revenue',
  'FROM   orders o',
  'JOIN   products p ON o.product_id = p.id',
  "WHERE  o.created_at >= '2024-01-01'",
  'GROUP  BY p.name',
  'ORDER  BY revenue DESC',
  'LIMIT  5;',
];

const CHAR_DELAY = 28;   // ms per character
const LINE_PAUSE = 180;  // ms pause between lines
const LOOP_PAUSE = 2800; // ms before restarting

export default function TypewriterCode() {
  const [lines, setLines] = useState([]);
  const [currentLine, setCurrentLine] = useState('');
  const timeoutRef = useRef(null);

  useEffect(() => {
    let lineIdx = 0;
    let charIdx = 0;
    let displayedLines = [];
    let running = true;

    function typeChar() {
      if (!running) return;

      if (lineIdx >= SQL_LINES.length) {
        // All lines done — pause then restart
        timeoutRef.current = setTimeout(() => {
          displayedLines = [];
          lineIdx = 0;
          charIdx = 0;
          setLines([]);
          setCurrentLine('');
          typeChar();
        }, LOOP_PAUSE);
        return;
      }

      const line = SQL_LINES[lineIdx];

      if (charIdx < line.length) {
        charIdx++;
        setCurrentLine(line.slice(0, charIdx));
        timeoutRef.current = setTimeout(typeChar, CHAR_DELAY);
      } else {
        // Line complete — move to next
        displayedLines = [...displayedLines, line];
        setLines([...displayedLines]);
        setCurrentLine('');
        lineIdx++;
        charIdx = 0;
        timeoutRef.current = setTimeout(typeChar, LINE_PAUSE);
      }
    }

    typeChar();

    return () => {
      running = false;
      clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="tw-code-block">
      {lines.map((line, i) => (
        <div key={i} className="tw-line tw-line--done">{line}</div>
      ))}
      {currentLine !== undefined && lines.length < SQL_LINES.length && (
        <div className="tw-line tw-line--active">
          {currentLine}
          <span className="tw-cursor" />
        </div>
      )}
    </div>
  );
}
