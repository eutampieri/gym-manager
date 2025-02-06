export enum EventType {
    Authenticate,
    ChatRequest,
    Error,
    Message,
    AcceptChatRequest,
    ChatEstablished,
    MessageDelivery,
    CloseChat,
    LeaveRoom,
    Subscribe,
    SubscriptionUpdate,
}

export enum SubscriptionEntity {
    CourseAvailability,
    TrainerAvailability,
}