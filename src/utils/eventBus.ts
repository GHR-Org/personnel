type Handler<T = any> = (data: T) => void;

class EventBus {
  private map = new Map<string, Set<Handler>>();
  private wildcard = new Set<Handler<{ event: string; payload: any }>>();

  on<T = any>(event: string, handler: Handler<T>) {
    if (event === "*") {
      this.wildcard.add(handler as Handler<{ event: string; payload: any }>);
      return () => this.wildcard.delete(handler as Handler<{ event: string; payload: any }>);
    }
    if (!this.map.has(event)) this.map.set(event, new Set());
    this.map.get(event)!.add(handler as Handler);
    return () => this.off(event, handler);
  }

  off<T = any>(event: string, handler: Handler<T>) {
    this.map.get(event)?.delete(handler as Handler);
  }

  emit<T = any>(event: string, payload: T) {
    this.map.get(event)?.forEach((h) => h(payload));
    this.wildcard.forEach((h) => h({ event, payload }));
  }
}

export const eventBus = new EventBus();
