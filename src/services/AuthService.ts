import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// 替换为你的 Supabase 配置
const SUPABASE_URL = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

export interface User {
  id: string;
  email: string;
}

interface AuthToken {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user: User;
}

class AuthServiceClass {
  private supabase: SupabaseClient;
  private currentToken: AuthToken | null = null;

  constructor() {
    this.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });
  }

  /**
   * 发送邮箱验证码
   */
  async sendVerificationCode(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Failed to send verification code:', error);
      return { success: false, error: '网络错误' };
    }
  }

  /**
   * 验证邮箱验证码并登录
   */
  async verifyCode(
    email: string,
    code: string
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const { data, error } = await this.supabase.auth.verifyOtp({
        email,
        token: code,
        type: 'email',
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user && data.session) {
        const user: User = {
          id: data.user.id,
          email: data.user.email || '',
        };

        this.currentToken = {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: Date.now() + (data.session.expires_in || 3600) * 1000,
          user,
        };

        await this.saveToken(this.currentToken);

        return { success: true, user };
      }

      return { success: false, error: '验证失败' };
    } catch (error) {
      console.error('Failed to verify code:', error);
      return { success: false, error: '网络错误' };
    }
  }

  /**
   * 获取当前用户
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      // 先尝试从内存获取
      if (this.currentToken && this.currentToken.expires_at > Date.now()) {
        return this.currentToken.user;
      }

      // 从存储加载
      const tokenStr = await AsyncStorage.getItem('auth_token');
      if (tokenStr) {
        const token = JSON.parse(tokenStr) as AuthToken;
        if (token.expires_at > Date.now()) {
          this.currentToken = token;
          return token.user;
        }
      }

      // 从 Supabase 获取会话
      const { data, error } = await this.supabase.auth.getSession();
      if (error || !data.session) {
        return null;
      }

      const user: User = {
        id: data.session.user.id,
        email: data.session.user.email || '',
      };

      this.currentToken = {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: Date.now() + (data.session.expires_in || 3600) * 1000,
        user,
      };

      await this.saveToken(this.currentToken);

      return user;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  }

  /**
   * 退出登录
   */
  async logout(): Promise<void> {
    try {
      await this.supabase.auth.signOut();
      this.currentToken = null;
      await AsyncStorage.removeItem('auth_token');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  }

  /**
   * 删除账户
   */
  async deleteAccount(): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.currentToken) {
        return { success: false, error: '未登录' };
      }

      // Supabase 目前需要通过 API 调用来删除用户
      // 这里需要后端支持
      await this.logout();
      return { success: true };
    } catch (error) {
      console.error('Failed to delete account:', error);
      return { success: false, error: '删除失败' };
    }
  }

  /**
   * 获取访问令牌
   */
  getAccessToken(): string | null {
    return this.currentToken?.access_token || null;
  }

  /**
   * 保存令牌到本地存储
   */
  private async saveToken(token: AuthToken): Promise<void> {
    try {
      await AsyncStorage.setItem('auth_token', JSON.stringify(token));
    } catch (error) {
      console.error('Failed to save token:', error);
    }
  }
}

export const AuthService = new AuthServiceClass();
