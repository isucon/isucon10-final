import type { xsuportal } from "../pb";
import type { ApiClient, ApiError } from "../ApiClient";

export class ContestantNotificationsObserver {
  client: ApiClient;
  last?: number;
  requesting: boolean;

  timer?: number;

  public onLastAnsweredClarificationIdChange?: (id: number | undefined) => any;
  public onNewNotifications?: (
    notifications: xsuportal.proto.resources.INotification[]
  ) => any;

  lastAnsweredClarificationId?: number;

  constructor(client: ApiClient) {
    this.client = client;
    this.last = undefined;
    this.requesting = false;
  }

  public start() {
    if (this.timer) return;
    console.log("ContestantNotificationsObserver: start");
    this.poll();
    this.timer = window.setInterval(this.poll.bind(this), 20000);
  }

  public shutdown() {
    if (!this.timer) return;
    console.log("ContestantNotificationsObserver: shutdown");
    window.clearInterval(this.timer);
  }

  public async poll() {
    if (this.requesting) return;
    try {
      this.requesting = true;
      const resp = await this.client.listNotifications(this.last);

      const lastAnsweredClarificationId =
        resp.lastAnsweredClarificationId === 0
          ? undefined
          : (resp.lastAnsweredClarificationId as number);
      if (
        lastAnsweredClarificationId !== this.lastAnsweredClarificationId &&
        this.onLastAnsweredClarificationIdChange
      ) {
        console.log(
          "ContestantNotificationsObserver: lastAnsweredClarificationId change",
          lastAnsweredClarificationId
        );
        this.onLastAnsweredClarificationIdChange(lastAnsweredClarificationId);
      }

      this.lastAnsweredClarificationId = lastAnsweredClarificationId;

      if (resp.notifications.length > 0 && this.onNewNotifications) {
        console.log(
          "ContestantNotificationsObserver: observed newNotifications",
          resp.notifications
        );
        this.onNewNotifications(resp.notifications);
      }

      const last = resp.notifications[resp.notifications.length - 1];
      this.last = (last?.id! as number) || this.last;
    } catch (e) {
      console.error("ContestantNotificationsObserver: error while polling", e);
      this.requesting = false;
    }
    this.requesting = false;
  }
}
