import { EventStatusEnum, EventTypeEnum, ParticipantRoleEnum } from '@musetrip360/event-management';

export const EventStatusName = {
  [EventStatusEnum.Draft]: 'Bản nháp',
  [EventStatusEnum.Pending]: 'Chờ duyệt',
  [EventStatusEnum.Published]: 'Đã phát hành',
  [EventStatusEnum.Cancelled]: 'Đã hủy',
  [EventStatusEnum.Expired]: 'Đã hết hạn',
};

export const EventTypeName = {
  [EventTypeEnum.Exhibition]: 'Triển lãm',
  [EventTypeEnum.Workshop]: 'Hội thảo',
  [EventTypeEnum.Lecture]: 'Bài giảng',
  [EventTypeEnum.SpecialEvent]: 'Sự kiện đặc biệt',
  [EventTypeEnum.HolidayEvent]: 'Sự kiện lễ hội',
  [EventTypeEnum.Other]: 'Khác',
};

export const ParticipantRoleName = {
  [ParticipantRoleEnum.Organizer]: 'Người tổ chức',
  [ParticipantRoleEnum.TourGuide]: 'Hướng dẫn viên',
  [ParticipantRoleEnum.Attendee]: 'Người tham dự',
  [ParticipantRoleEnum.Guest]: 'Khách mời',
};
