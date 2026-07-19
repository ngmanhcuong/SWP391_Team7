const User = require('../models/User');

const DEV_USERS = [
  {
    fullName: 'TS.BS. Nguyen Van An',
    email: 'nguyen.van.an@medicare.com',
    phone: '0903112201',
    password: 'Medicare@123',
    role: 'doctor',
    occupation: 'Khoa Tim mach',
    isEmailVerified: true,
    gender: 'male',
    address: '45 Nguyen Binh Khiem, Phuong Ben Nghe, Quan 1, TP.HCM',
    bio: 'Bac si chuyen sau Tim mach voi hon 15 nam kinh nghiem dieu tri tang huyet ap va roi loan nhip tim.',
  },
  {
    fullName: 'TS.BS. Tran Minh Bach',
    email: 'tran.minh.bach@medicare.com',
    phone: '0903112202',
    password: 'Medicare@123',
    role: 'doctor',
    occupation: 'Khoa Tim mach',
    isEmailVerified: true,
    gender: 'male',
    address: '11 Nguyen Du, Phuong Ben Nghe, Quan 1, TP.HCM',
    bio: 'Chuyen tu van va dieu tri benh tim mach noi khoa, theo doi tang huyet ap va suy tim.',
  },
  {
    fullName: 'BSCKII. Le Hoang Cuong',
    email: 'le.hoang.cuong@medicare.com',
    phone: '0903112203',
    password: 'Medicare@123',
    role: 'doctor',
    occupation: 'Khoa Tim mach',
    isEmailVerified: true,
    gender: 'male',
    address: '78 Hai Ba Trung, Phuong Ben Nghe, Quan 1, TP.HCM',
    bio: 'Bac si tim mach nhieu nam kinh nghiem, theo doi benh ly mach vanh va roi loan nhip.',
  },
  {
    fullName: 'BS. Pham Thu Dung',
    email: 'pham.thu.dung@medicare.com',
    phone: '0909112207',
    password: 'Medicare@123',
    role: 'doctor',
    occupation: 'Khoa Co xuong khop',
    isEmailVerified: true,
    gender: 'female',
    address: '12 Quoc Huong, Phuong Thao Dien, TP. Thu Duc, TP.HCM',
    bio: 'Chuyen kham va dieu tri benh ly co xuong khop, dau vai gay va phuc hoi chuc nang.',
  },
  {
    fullName: 'BSCKI. Hoang Van Duc',
    email: 'hoang.van.duc@medicare.com',
    phone: '0909112208',
    password: 'Medicare@123',
    role: 'doctor',
    occupation: 'Khoa Co xuong khop',
    isEmailVerified: true,
    gender: 'male',
    address: '32 Nguyen Co Thach, Phuong An Loi Dong, TP. Thu Duc, TP.HCM',
    bio: 'Chuyen gia dieu tri dau cot song, thoai hoa khop va chan thuong van dong.',
  },
  {
    fullName: 'TS.BS. Tran Thi Phuong',
    email: 'tran.thi.phuong@medicare.com',
    phone: '0909112209',
    password: 'Medicare@123',
    role: 'doctor',
    occupation: 'Khoa Co xuong khop',
    isEmailVerified: true,
    gender: 'female',
    address: '86 Xa Lo Ha Noi, Phuong An Phu, TP. Thu Duc, TP.HCM',
    bio: 'Theo doi va dieu tri cac benh ly co xuong khop man tinh, dau than kinh toa va phuc hoi chuc nang.',
  },
  {
    fullName: 'BS. Nguyen Thi Giang',
    email: 'nguyen.thi.giang@medicare.com',
    phone: '0910112208',
    password: 'Medicare@123',
    role: 'doctor',
    occupation: 'Khoa San & Nhi',
    isEmailVerified: true,
    gender: 'female',
    address: '6A Tran Nao, Phuong An Khanh, TP. Thu Duc, TP.HCM',
    bio: 'Bac si San & Nhi phu trach theo doi thai ky, kham nhi va tu van suc khoe cho tre nho.',
  },
  {
    fullName: 'BSCKII. Le Van Hung',
    email: 'le.van.hung@medicare.com',
    phone: '0910112209',
    password: 'Medicare@123',
    role: 'doctor',
    occupation: 'Khoa San & Nhi',
    isEmailVerified: true,
    gender: 'male',
    address: '15 Tran Nao, Phuong An Khanh, TP. Thu Duc, TP.HCM',
    bio: 'Chuyen cham soc suc khoe tre em, tiem chung va kham nhi tong quat.',
  },
  {
    fullName: 'TS.BS. Tran Thi Mai',
    email: 'tran.thi.mai@medicare.com',
    phone: '0910112210',
    password: 'Medicare@123',
    role: 'doctor',
    occupation: 'Khoa San & Nhi',
    isEmailVerified: true,
    gender: 'female',
    address: '88 Song Hanh, Phuong An Phu, TP. Thu Duc, TP.HCM',
    bio: 'Bac si san phu khoa va nhi khoa, theo doi thai ky va tu van dinh duong tre nho.',
  },
  {
    fullName: 'BS. Tran Anh Khoa',
    email: 'tran.anh.khoa@medicare.com',
    phone: '0911112209',
    password: 'Medicare@123',
    role: 'doctor',
    occupation: 'Khoa Mat',
    isEmailVerified: true,
    gender: 'male',
    address: '119 Pasteur, Phuong Vo Thi Sau, Quan 3, TP.HCM',
    bio: 'Bac si chuyen khoa Mat voi kinh nghiem theo doi tat khuc xa va benh ly vong mac.',
  },
  {
    fullName: 'BSCKII. Pham Hoang Long',
    email: 'pham.hoang.long@medicare.com',
    phone: '0911112210',
    password: 'Medicare@123',
    role: 'doctor',
    occupation: 'Khoa Mat',
    isEmailVerified: true,
    gender: 'male',
    address: '21 Dien Bien Phu, Phuong Vo Thi Sau, Quan 3, TP.HCM',
    bio: 'Chuyen kham benh ly mat nguoi lon, duc thuy tinh the va theo doi vong mac.',
  },
  {
    fullName: 'TS.BS. Vo Minh Lam',
    email: 'vo.minh.lam@medicare.com',
    phone: '0911112211',
    password: 'Medicare@123',
    role: 'doctor',
    occupation: 'Khoa Mat',
    isEmailVerified: true,
    gender: 'male',
    address: '57 Nguyen Dinh Chieu, Phuong Vo Thi Sau, Quan 3, TP.HCM',
    bio: 'Theo doi chuyen sau cac benh ly khuc xa, kho mat va nhuc moi mat do lam viec keo dai.',
  },
  {
    fullName: 'Nguyen Minh Khoi',
    email: 'nguyen.minh.khoi@example.com',
    phone: '0904112202',
    password: 'Medicare@123',
    role: 'patient',
    isEmailVerified: true,
    gender: 'male',
    dateOfBirth: new Date('1990-05-14'),
    address: '128 Vo Van Tan, Phuong Vo Thi Sau, Quan 3, TP.HCM',
    nationalId: '079090123456',
    emergencyPhone: '0909777666',
    occupation: 'Ky su xay dung',
    height: 172,
    weight: 68,
    healthScore: 82,
  },
  {
    fullName: 'Truong My Duyen',
    email: 'truong.my.duyen@medicare.com',
    phone: '0905112203',
    password: 'Medicare@123',
    role: 'receptionist',
    isEmailVerified: true,
    gender: 'female',
    address: '22 Hoang Sa, Phuong Tan Dinh, Quan 1, TP.HCM',
    occupation: 'Le tan y khoa',
  },
  {
    fullName: 'Admin Medicare',
    email: 'adminmedicare@medicare.com',
    phone: '0906112204',
    password: 'Medicare@123',
    role: 'admin',
    isEmailVerified: true,
    gender: 'other',
    address: '10 Dien Bien Phu, Phuong Da Kao, Quan 1, TP.HCM',
    occupation: 'Quan tri he thong',
  },
  {
    fullName: 'Pham Thu Ha',
    email: 'pham.thu.ha@medicare.com',
    phone: '0907112205',
    password: 'Medicare@123',
    role: 'receptionist',
    isEmailVerified: true,
    gender: 'female',
    address: '84 Nguyen Huu Canh, Phuong 22, Binh Thanh, TP.HCM',
    occupation: 'Le tan y khoa',
  },
  {
    fullName: 'Le Thao Nhi',
    email: 'le.thao.nhi@example.com',
    phone: '0912112210',
    password: 'Medicare@123',
    role: 'patient',
    isEmailVerified: true,
    gender: 'female',
    dateOfBirth: new Date('1997-11-02'),
    address: '33 Le Van Sy, Phuong 13, Phu Nhuan, TP.HCM',
    nationalId: '079197654321',
    emergencyPhone: '0908666555',
    occupation: 'Nhan vien ke toan',
    height: 160,
    weight: 52,
    healthScore: 88,
  },
  {
    fullName: 'Vu Gia Han',
    email: 'vu.gia.han@example.com',
    phone: '0913112211',
    password: 'Medicare@123',
    role: 'patient',
    isEmailVerified: true,
    gender: 'female',
    dateOfBirth: new Date('1988-03-20'),
    address: '155 Phan Xich Long, Phuong 7, Phu Nhuan, TP.HCM',
    nationalId: '079188765432',
    emergencyPhone: '0913999888',
    occupation: 'Giao vien',
    height: 158,
    weight: 56,
    healthScore: 79,
  },
  {
    fullName: 'Le Hoang Minh',
    email: 'le.hoang.minh@medicare.com',
    phone: '0914112212',
    password: 'Medicare@123',
    role: 'receptionist',
    isEmailVerified: true,
    gender: 'male',
    address: '91 Nguyen Trai, Phuong Ben Thanh, Quan 1, TP.HCM',
    occupation: 'Dieu phoi tiep nhan',
  },
];

const seedDevUsers = async () => {
  if (process.env.NODE_ENV === 'production' || process.env.SEED_DEV_USERS === 'false') {
    return;
  }

  for (const data of DEV_USERS) {
    const email = data.email.toLowerCase();
    const existing = await User.findOne({ email });

    if (!existing) {
      await User.create({ ...data, email });
      console.log(`Seeded dev user: ${email} (${data.role})`);
      continue;
    }

    existing.fullName = data.fullName;
    existing.phone = data.phone;
    existing.role = data.role;
    existing.occupation = data.occupation;
    existing.isEmailVerified = data.isEmailVerified;
    existing.gender = data.gender;
    existing.address = data.address;
    existing.dateOfBirth = data.dateOfBirth;
    existing.nationalId = data.nationalId;
    existing.emergencyPhone = data.emergencyPhone;
    existing.height = data.height;
    existing.weight = data.weight;
    existing.healthScore = data.healthScore;
    existing.bio = data.bio;
    existing.isActive = true;
    existing.password = data.password;
    await existing.save();
    console.log(`Refreshed dev user: ${email} (${data.role})`);
  }
};

module.exports = seedDevUsers;
