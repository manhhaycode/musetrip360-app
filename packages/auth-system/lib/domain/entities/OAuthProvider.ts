import { AuthTypeEnum } from '../../types';

export class OAuthProvider {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly type: AuthTypeEnum,
    public readonly clientId: string,
    public readonly redirectUri: string,
    public readonly scope: string[],
    public readonly authorizationUrl: string,
    public readonly tokenUrl: string,
    public readonly userInfoUrl: string,
    public readonly isEnabled: boolean = true,
    public readonly metadata?: Record<string, any>
  ) {}

  // Business methods
  isGoogleProvider(): boolean {
    return this.type === AuthTypeEnum.Google;
  }

  isFacebookProvider(): boolean {
    return this.type === AuthTypeEnum.Facebook;
  }

  isFirebaseProvider(): boolean {
    return this.type === AuthTypeEnum.Firebase;
  }

  hasScope(scope: string): boolean {
    return this.scope.includes(scope);
  }

  getAuthorizationUrl(state: string, additionalParams?: Record<string, string>): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: this.scope.join(' '),
      state,
      response_type: 'code',
      ...additionalParams,
    });

    return `${this.authorizationUrl}?${params.toString()}`;
  }

  getScopeString(): string {
    return this.scope.join(' ');
  }

  // Factory methods
  static createGoogleProvider(
    clientId: string,
    redirectUri: string,
    scope: string[] = ['openid', 'email', 'profile']
  ): OAuthProvider {
    return new OAuthProvider(
      'google',
      'Google',
      AuthTypeEnum.Google,
      clientId,
      redirectUri,
      scope,
      'https://accounts.google.com/o/oauth2/v2/auth',
      'https://oauth2.googleapis.com/token',
      'https://www.googleapis.com/oauth2/v2/userinfo',
      true
    );
  }

  static createFacebookProvider(
    clientId: string,
    redirectUri: string,
    scope: string[] = ['email', 'public_profile']
  ): OAuthProvider {
    return new OAuthProvider(
      'facebook',
      'Facebook',
      AuthTypeEnum.Facebook,
      clientId,
      redirectUri,
      scope,
      'https://www.facebook.com/v18.0/dialog/oauth',
      'https://graph.facebook.com/v18.0/oauth/access_token',
      'https://graph.facebook.com/me',
      true
    );
  }

  static createFirebaseProvider(projectId: string, redirectUri: string): OAuthProvider {
    return new OAuthProvider(
      'firebase',
      'Firebase',
      AuthTypeEnum.Firebase,
      projectId,
      redirectUri,
      ['email', 'profile'],
      `https://${projectId}.firebaseapp.com/__/auth/handler`,
      `https://securetoken.googleapis.com/v1/token?key=${projectId}`,
      'https://www.googleapis.com/oauth2/v1/userinfo',
      true
    );
  }

  // Update methods
  updateScope(scope: string[]): OAuthProvider {
    return new OAuthProvider(
      this.id,
      this.name,
      this.type,
      this.clientId,
      this.redirectUri,
      scope,
      this.authorizationUrl,
      this.tokenUrl,
      this.userInfoUrl,
      this.isEnabled,
      this.metadata
    );
  }

  updateRedirectUri(redirectUri: string): OAuthProvider {
    return new OAuthProvider(
      this.id,
      this.name,
      this.type,
      this.clientId,
      redirectUri,
      this.scope,
      this.authorizationUrl,
      this.tokenUrl,
      this.userInfoUrl,
      this.isEnabled,
      this.metadata
    );
  }

  enable(): OAuthProvider {
    return new OAuthProvider(
      this.id,
      this.name,
      this.type,
      this.clientId,
      this.redirectUri,
      this.scope,
      this.authorizationUrl,
      this.tokenUrl,
      this.userInfoUrl,
      true,
      this.metadata
    );
  }

  disable(): OAuthProvider {
    return new OAuthProvider(
      this.id,
      this.name,
      this.type,
      this.clientId,
      this.redirectUri,
      this.scope,
      this.authorizationUrl,
      this.tokenUrl,
      this.userInfoUrl,
      false,
      this.metadata
    );
  }

  updateMetadata(metadata: Record<string, any>): OAuthProvider {
    return new OAuthProvider(
      this.id,
      this.name,
      this.type,
      this.clientId,
      this.redirectUri,
      this.scope,
      this.authorizationUrl,
      this.tokenUrl,
      this.userInfoUrl,
      this.isEnabled,
      { ...this.metadata, ...metadata }
    );
  }
}
