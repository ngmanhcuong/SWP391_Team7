import api from '../../../services/api';

const unwrap = <T>(res: { data: { data: T } }): T => res.data.data;

export interface HomeSpecialty {
  id: string;
  name: string;
  departmentLabel: string;
  doctorCount: number;
}

export interface HomeDoctor {
  id: string;
  name: string;
  specialty: string;
  reviews: number;
  experience: string;
  rating: number;
  avatarBg: string;
}

export interface HomeData {
  stats: {
    doctors: number;
    patients: number;
    specialties: number;
    satisfactionRate: string;
  };
  featuredSpecialties: HomeSpecialty[];
  featuredDoctors: HomeDoctor[];
}

export const homeApi = {
  getHomeData: async (): Promise<HomeData> => unwrap(await api.get('/public/home')),
};
