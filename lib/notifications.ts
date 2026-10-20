// Запрос разрешения на уведомления
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!("Notification" in window)) {
    console.log("Браузер не поддерживает уведомления");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
};

// Отправка уведомления
export const sendNotification = (title: string, body: string) => {
  if (Notification.permission === "granted") {
    new Notification(title, {
      body,
      icon: "/favicon.ico",
      badge: "/favicon.ico",
    });
  }
};

// Проверка просроченных напоминаний
export const checkOverdueReminders = async (
  supabase: any,
  lastChecked: string | null
) => {
  const now = new Date().toISOString();
  const since = lastChecked || new Date(Date.now() - 5 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from("reminders")
    .select("*")
    .eq("completed", false)
    .gte("remind_at", since)
    .lte("remind_at", now);

  if (!error && data && data.length > 0) {
    data.forEach((reminder: any) => {
      sendNotification("⏰ Напоминание", reminder.title);
    });
    return now;
  }

  return lastChecked;
};