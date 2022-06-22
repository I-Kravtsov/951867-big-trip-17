import { FilterType } from '../const';
import dayjs from 'dayjs';
const isFuture = (dateFrom) => dayjs(dateFrom).isAfter(dayjs(), 'D') || dayjs(dateFrom).isSame(dayjs(), 'D');
const isPast = (dateTo) => dayjs(dateTo).isBefore(dayjs(), 'D') || dayjs(dateTo).isSame(dayjs(), 'D');
const isNow = (dateFrom, dateTo) => dayjs(dateFrom).isBefore(dayjs(), 'D') && dayjs(dateTo).isAfter(dayjs(), 'D');

export const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isFuture(point.dateFrom) || isNow(point.dateFrom, point.dateTo)),
  [FilterType.PAST]: (points) => points.filter((point) => isPast(point.dateTo) || isNow(point.dateFrom, point.dateTo)),
};
