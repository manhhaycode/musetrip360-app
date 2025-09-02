/* eslint-disable import/no-extraneous-dependencies */
import { useMemo } from 'react';
import { useGetPoliciesByMuseum, MuseumPolicy, PolicyTypeEnum } from '@musetrip360/museum-management';
import { Card, CardContent } from '@musetrip360/ui-core/card';
import { Badge } from '@musetrip360/ui-core/badge';
import { Alert, AlertDescription } from '@musetrip360/ui-core/alert';
import { Skeleton } from '@musetrip360/ui-core/skeleton';
import { FileText, Users, MapPin, RefreshCw, AlertCircle, Shield } from 'lucide-react';
import { cn } from '@musetrip360/ui-core/utils';
import get from 'lodash/get';

interface MuseumPoliciesTabProps {
  museumId: string;
  className?: string;
}

const policyTypeConfig = {
  [PolicyTypeEnum.TermsOfService]: {
    icon: FileText,
    label: 'Điều khoản dịch vụ',
    color: 'bg-blue-500/10 text-blue-700 border-blue-200',
  },
  [PolicyTypeEnum.Visitor]: {
    icon: Users,
    label: 'Chính sách khách tham quan',
    color: 'bg-green-500/10 text-green-700 border-green-200',
  },
  [PolicyTypeEnum.Tour]: {
    icon: MapPin,
    label: 'Chính sách tour',
    color: 'bg-purple-500/10 text-purple-700 border-purple-200',
  },
  [PolicyTypeEnum.Refund]: {
    icon: RefreshCw,
    label: 'Chính sách hoàn tiền',
    color: 'bg-orange-500/10 text-orange-700 border-orange-200',
  },
};

export function MuseumPoliciesTab({ museumId, className }: MuseumPoliciesTabProps) {
  const {
    data: policiesResponse,
    isLoading,
    error,
  } = useGetPoliciesByMuseum(
    museumId,
    { Page: 1, PageSize: 100 },
    {
      enabled: !!museumId,
      staleTime: 5 * 60 * 1000, // 5 minutes cache
      gcTime: 10 * 60 * 1000, // 10 minutes
    }
  );

  const policies: MuseumPolicy[] = get(policiesResponse, 'list', []);

  const activePolicies = useMemo(() => {
    if (!policies) return [];

    return policies.filter((policy: MuseumPolicy) => policy.isActive).sort((a, b) => a.zOrder - b.zOrder);
  }, [policies]);

  const groupedPolicies = useMemo(() => {
    const groups: Record<PolicyTypeEnum, MuseumPolicy[]> = {
      [PolicyTypeEnum.TermsOfService]: [],
      [PolicyTypeEnum.Visitor]: [],
      [PolicyTypeEnum.Tour]: [],
      [PolicyTypeEnum.Refund]: [],
    };

    activePolicies.forEach((policy) => {
      if (groups[policy.policyType]) {
        groups[policy.policyType].push(policy);
      }
    });

    return groups;
  }, [activePolicies]);

  if (isLoading) {
    return (
      <div className={cn('space-y-6', className)}>
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <Skeleton className="h-8 w-48" />
                </div>
                <div className="space-y-4">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn('space-y-6', className)}>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Không thể tải thông tin chính sách. Vui lòng thử lại sau.</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (activePolicies.length === 0) {
    return (
      <div className={cn('space-y-6', className)}>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-12">
            <div className="text-center">
              <div className="mb-6">
                <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-muted-foreground mb-2">Chưa có chính sách công khai</h3>
                <p className="text-muted-foreground text-lg">
                  Bảo tàng chưa công bố các chính sách cho khách tham quan.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn('space-y-8', className)}>
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Chính sách & Quy định
                </h1>
                <p className="text-muted-foreground text-lg">Thông tin về các chính sách và quy định của bảo tàng</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">
                {activePolicies.length} chính sách đang áp dụng
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Policy Groups */}
      <div className="grid gap-6 lg:gap-8">
        {Object.entries(groupedPolicies).map(([policyType, policies]) => {
          if (policies.length === 0) return null;

          const config = policyTypeConfig[policyType as PolicyTypeEnum];
          const Icon = config.icon;

          return (
            <Card key={policyType} className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold">{config.label}</h2>
                    <p className="text-muted-foreground">
                      {policies.length} {policies.length === 1 ? 'chính sách' : 'chính sách'}
                    </p>
                  </div>
                  <Badge className={cn('text-sm', config.color)}>{config.label}</Badge>
                </div>

                <div className="space-y-6">
                  {policies.map((policy, index) => (
                    <div key={policy.id}>
                      {index > 0 && <hr className="my-6 border-border/50" />}
                      <div className="space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="text-xl font-semibold leading-tight flex-1">{policy.title}</h3>
                        </div>
                        <div className="prose prose-lg max-w-none">
                          <div
                            className="text-muted-foreground leading-relaxed whitespace-pre-wrap"
                            style={{ wordBreak: 'break-word' }}
                          >
                            {policy.content}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Footer Note */}
      <Card className="border-0 shadow-lg bg-muted/30">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <FileText className="h-4 w-4" />
            <p>
              Các chính sách này có hiệu lực từ thời điểm được công bố. Bảo tàng có quyền thay đổi và cập nhật các chính
              sách khi cần thiết.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
