interface RegisterBody {
  email: string;
  password: string;
  confirmPassword: string;
}

interface LoginBody {
  email: string;
  password: string;
}

interface LogoutBody {
  refreshToken: string;
}

interface AccessTokenBody {
  refreshToken: string;
}
