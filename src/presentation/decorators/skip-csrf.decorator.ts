import { SetMetadata } from '@nestjs/common';

export const SKIP_CSRF_KEY = 'skipCsrf';
export const SkipCsrfCheck = () => SetMetadata(SKIP_CSRF_KEY, true);
