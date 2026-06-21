import { useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { receptionistApi } from '../services/receptionistApi';
import {
  Appointment,
  AppointmentFilters,
  CreateAppointmentInput,
  CreatePatientInput,
  Overview,
  Patient,
  QueueAction,
  QueueResponse,
} from '../types';

// Shared query namespace for all receptionist data.
const ROOT_KEY = ['receptionist'];

// Invalidate every receptionist query so all linked pages stay in sync.
const useInvalidateAll = () => {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: ROOT_KEY });
};

export const useReceptionistOverview = (): UseQueryResult<Overview> =>
  useQuery<Overview>({
    queryKey: ['receptionist', 'overview'],
    queryFn: receptionistApi.getOverview,
    staleTime: 10_000,
  });

export const usePatients = (q?: string): UseQueryResult<Patient[]> =>
  useQuery<Patient[]>({
    queryKey: ['receptionist', 'patients', q ?? ''],
    queryFn: () => receptionistApi.listPatients(q),
    staleTime: 10_000,
  });

export const useCreatePatient = () => {
  const invalidate = useInvalidateAll();
  return useMutation({
    mutationFn: (input: CreatePatientInput) => receptionistApi.createPatient(input),
    onSuccess: invalidate,
  });
};

export const useAppointments = (filters?: AppointmentFilters): UseQueryResult<Appointment[]> =>
  useQuery<Appointment[]>({
    queryKey: ['receptionist', 'appointments', filters ?? {}],
    queryFn: () => receptionistApi.listAppointments(filters),
    staleTime: 5_000,
  });

export const useCreateAppointment = () => {
  const invalidate = useInvalidateAll();
  return useMutation({
    mutationFn: (input: CreateAppointmentInput) => receptionistApi.createAppointment(input),
    onSuccess: invalidate,
  });
};

export const useUpdateAppointmentStatus = () => {
  const invalidate = useInvalidateAll();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      receptionistApi.updateAppointmentStatus(id, status),
    onSuccess: invalidate,
  });
};

export const useCheckinAppointment = () => {
  const invalidate = useInvalidateAll();
  return useMutation({
    mutationFn: (id: string) => receptionistApi.checkinAppointment(id),
    onSuccess: invalidate,
  });
};

export const useQueue = (roomKey?: string): UseQueryResult<QueueResponse> =>
  useQuery<QueueResponse>({
    queryKey: ['receptionist', 'queue', roomKey ?? 'all'],
    queryFn: () => receptionistApi.getQueue(roomKey),
    staleTime: 5_000,
  });

export const useManualAddQueue = () => {
  const invalidate = useInvalidateAll();
  return useMutation({
    mutationFn: (input: { patientName: string; code?: string; doctor?: string; roomKey?: string }) =>
      receptionistApi.manualAddQueue(input),
    onSuccess: invalidate,
  });
};

export const useCallNext = () => {
  const invalidate = useInvalidateAll();
  return useMutation({
    mutationFn: () => receptionistApi.callNext(),
    onSuccess: invalidate,
  });
};

export const useUpdateQueueTicket = () => {
  const invalidate = useInvalidateAll();
  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: QueueAction }) =>
      receptionistApi.updateTicket(id, action),
    onSuccess: invalidate,
  });
};
