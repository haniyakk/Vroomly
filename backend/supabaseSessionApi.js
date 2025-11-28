import { supabase } from "./supabaseClient";

/*
SESSION LOGIC:
- Driver taps "Send Reminder"
creates NEW session
resets attendance  
returns session_id
*/

export async function startSession(driverId) {
  // 1. Create new active session
  const { data: session, error: sessionErr } = await supabase
    .from("sessions")
    .insert([{ driver_id: driverId, active: true }])
    .select()
    .single();

  if (sessionErr) return { error: sessionErr.message };

  const session_id = session.id;

  // 2. Reset attendance for all students for this new session
  const { error: insertErr } = await supabase.rpc("create_attendance_for_all", {
    session_id_input: session_id,
  });

  if (insertErr) return { error: insertErr.message };

  return { session_id };
}

/*
STUDENT MARKS STATUS:
- Student chooses "present" or "coming"
*/
export async function markStatus({ studentId, sessionId, status }) {
  const { data, error } = await supabase
    .from("attendance")
    .update({ status })
    .eq("student_id", studentId)
    .eq("session_id", sessionId)
    .select()
    .single();

  if (error) return { error: error.message };
  return { data };
}

/*
FINAL REMINDER (5 min before):
Only send to students with status "absent"
*/
export async function sendFinalReminder(driverId, sessionId) {
  const { data: absentStudents, error } = await supabase
    .from("attendance")
    .select("student_id")
    .eq("session_id", sessionId)
    .eq("status", "absent");

  if (error) return { error: error.message };

  // Insert notification for each absent student
  for (let s of absentStudents) {
    await supabase.from("notifications").insert([
      {
        sender_id: driverId,
        message: "Van is leaving in 5 minutes! Hurry up.",
      },
    ]);
  }

  return { ok: true };
}

/*
FETCH VIEW LIST FOR DRIVER
*/
export async function fetchViewList(sessionId) {
  const { data, error } = await supabase
    .from("attendance")
    // include user's driver_id so frontend can filter by assigned driver
    .select("status, student_id, users(name, reg_no, driver_id)")
    .eq("session_id", sessionId);

  if (error) return { error: error.message };
  return { data };
}
