import { useEffect, useState } from "react";
import http from "../api/http";

import { getActivitiesByDate, createActivity, updateActivity } from "../api/aktivnosti";
import { getCommentsByDate, createComment, updateComment } from "../api/komentari";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { toast } from "react-toastify";

export default function Kalendar() {
  const [klik, setKlik] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState("");
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [existingActivityId, setExistingActivityId] = useState(null);
  const [existingCommentId, setExistingCommentId] = useState(null);

  const [puniDani, setPuniDani] = useState(new Set());
  useEffect(() => {
    (async () => {
      try {
        const { data } = await http.get("/activities");

        const arr = Array.isArray(data) ? data : (data?.data ?? []);

        const datumi = new Set(
          arr
            .map(a => a.activity_date)
            .filter(Boolean)
            .map(s => String(s).slice(0, 10))
        );

        setPuniDani(datumi);
      } catch (err) {
        console.error("Greška pri učitavanju aktivnosti:", err);
      }
    })();
  }, []);

  async function handleDateClick(info) {
    const [y,m,d] = info.dateStr.split("-");
    const prikaz = `${d}.${m}.${y}`;
    setKlik({ dateStr: info.dateStr, prikaz });

    try {
      const acts = await getActivitiesByDate(info.dateStr);
      if (acts.length > 0) {
        setExistingActivityId(acts[0].id);
        setSelectedActivity(acts[0].activity_type);
      } else {
        setExistingActivityId(null);
        setSelectedActivity("");
      }

      const coms = await getCommentsByDate(info.dateStr);
      if (Array.isArray(coms) && coms.length > 0) {
        setExistingCommentId(coms[0]?.id ?? null);
        setComment(coms[0]?.text ?? "");
      } else {
        setExistingCommentId(null);
        setComment("");
      }
    } catch (e) {
      console.error(e);
      setExistingActivityId(null);
      setExistingCommentId(null);
      setSelectedActivity("");
      setComment("");
    }
  }

  function closeModal() {
    setKlik(null);
    setSelectedActivity("");
    setComment("");
    setSaving(false);
    setExistingActivityId(null);
    setExistingCommentId(null);
  }

  async function handleSaveLocal() {
    if (!klik?.dateStr || (!selectedActivity && !(comment ?? "").trim())) return;
    try {
      setSaving(true);

      if (selectedActivity) {
        let activityId = existingActivityId;
        if (activityId) {
          await updateActivity(activityId, { activity_type: selectedActivity });
        } else {
          const a = await createActivity({
            activity_date: klik.dateStr,
            activity_type: selectedActivity,
          });
          setExistingActivityId(a.id);
        }
      }

      const trimmed = (comment ?? "").trim();
      if (trimmed) {
        if (existingCommentId) {
          await updateComment(existingCommentId, { text: trimmed });
        } else {
          const c = await createComment({ date: klik.dateStr, text: trimmed });
          setExistingCommentId(c.id);
        }
      }

      setPuniDani(prev => {
        const s = new Set(prev);
        s.add(klik.dateStr);
        return s;
      });

      setSaving(false);
      toast.success("Uspešno sačuvano!");
    } catch (error) {
      console.error("Greška pri čuvanju:", error);
      toast.error(error?.response?.data?.message || "Greška pri čuvanju.");
      setSaving(false);
    }
  }

  const dayToIso = (date) => {
    const pad = (n) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}`;
  };

  return (
    <>
      <div className="kalendar">
        <FullCalendar
          className="datumi"
          plugins={[dayGridPlugin, interactionPlugin]}
          fixedWeekCount={false}
          dateClick={handleDateClick}

          dayCellClassNames={(arg) => {
            const iso = dayToIso(arg.date);
            return puniDani.has(iso) ? ["has-data"] : [];
          }}
        />

        {klik && (
          <div className="pozadina-prozora" onClick={closeModal}>
            <div className="prozor" onClick={(e) => e.stopPropagation()}>
              <h3 className="podnaslov">{klik.prikaz}</h3>

              <select value={selectedActivity} onChange={(e) => setSelectedActivity(e.target.value)}>
                <option value="">Izaberi aktivnost</option>
                <option value="sadnja">Sadnja</option>
                <option value="zalivanje">Zalivanje</option>
                <option value="presadjivanje">Presađivanje</option>
                <option value="djubrenje">Đubrenje</option>
                <option value="obrezivanje">Obrezivanje</option>
                <option value="berba">Berba</option>
                <option value="drugo">Drugo</option>
              </select>

              <textarea
                value={comment ?? ""}
                onChange={(e) => setComment(e.target.value)}
                spellCheck="false"
                rows={10}
                placeholder="Komentar…"
              />

              <div className="potvrda">
                <button className="dugme-forma" onClick={closeModal} disabled={saving}>Zatvori</button>
                <button
                  className="dugme-forma"
                  onClick={handleSaveLocal}
                  disabled={saving || (!selectedActivity && !(comment ?? "").trim())}
                  style={{ opacity: (saving || (!selectedActivity && !(comment ?? "").trim())) ? 0.6 : 1 }}
                >
                  {saving ? "Čuvanje..." : "Sačuvaj"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
