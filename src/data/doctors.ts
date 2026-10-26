import type { Doctor } from '../types';

export const INITIAL_DOCTORS: Doctor[] = [
    {
        id: 'doc-1',
        name: 'Dr. ნინო ბერიძე',
        specialty: 'კარდიოლოგი',
        rating: 4.9,
        experience: '12 წელი',
        availableSlots: ['10:00', '11:30', '14:00', '16:00'],
    },
    {
        id: 'doc-2',
        name: 'Dr. გიორგი მაისურაძე',
        specialty: 'ნევროლოგი',
        rating: 4.8,
        experience: '9 წელი',
        availableSlots: ['09:30', '12:00', '15:30'],
    },
    {
        id: 'doc-3',
        name: 'Dr. თამარ კაპანაძე',
        specialty: 'პედიატრი',
        rating: 5.0,
        experience: '15 წელი',
        availableSlots: ['11:00', '13:00', '14:30'],
    },
    {
        id: 'doc-4',
        name: 'Dr. დავით ლომიძე',
        specialty: 'თერაპევტი',
        rating: 4.7,
        experience: '7 წელი',
        availableSlots: ['10:30', '12:30', '16:30'],
    },
];