import { Museum } from '@musetrip360/museum-management';
import { Card, CardContent } from '@musetrip360/ui-core/card';
import { Button } from '@musetrip360/ui-core/button';
import { Badge } from '@musetrip360/ui-core/badge';
import { MapPin, Phone, Mail, Star, Globe, Clock } from 'lucide-react';
import { cn } from '@musetrip360/ui-core/utils';
import { ImageGrid } from './ImageGrid';

interface MuseumIntroTabProps {
  museum: Museum;
  className?: string;
}

export function MuseumIntroTab({ museum, className }: MuseumIntroTabProps) {
  const { metadata, name, description, location, contactPhone, contactEmail, rating, categories } = museum;

  const renderSocialLinks = () => {
    if (!metadata?.socialLinks) return null;

    const socialItems = [{ icon: Globe, url: metadata.socialLinks.website, label: 'Website' }].filter(
      (item) => item.url
    );

    if (socialItems.length === 0) return null;

    return (
      <div className="flex gap-2 flex-wrap">
        {socialItems.map(({ icon: Icon, url, label }) => (
          <Button key={label} variant="outline" size="sm" asChild className="h-8">
            <a href={url} target="_blank" rel="noopener noreferrer">
              <Icon className="h-4 w-4 mr-2" />
              {label}
            </a>
          </Button>
        ))}
      </div>
    );
  };

  const renderCategories = () => {
    if (!categories || categories.length === 0) return null;

    return (
      <div className="flex gap-2 flex-wrap">
        {categories.map((category: { id: string; name: string }) => (
          <Badge
            key={category.id}
            className="bg-gradient-to-r from-primary/10 to-primary/20 text-primary hover:from-primary/20 hover:to-primary/30 border-primary/20 text-sm font-medium px-3 py-1"
          >
            {category.name}
          </Badge>
        ))}
      </div>
    );
  };

  return (
    <div className={cn('space-y-8', className)}>
      {/* Hero Section with Gradient Background */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Images with Modern Styling */}
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-2xl opacity-30"></div>
                <div className="relative">
                  {metadata?.images && metadata.images.length > 0 ? (
                    <div className="overflow-hidden rounded-2xl shadow-2xl">
                      <ImageGrid images={metadata.images} />
                    </div>
                  ) : (
                    <div className="w-full pt-[56.25%] relative rounded-2xl overflow-hidden bg-gradient-to-br from-muted/50 to-muted border-2 border-dashed border-muted-foreground/20">
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                        <div className="text-center">
                          <div className="text-4xl mb-2">🏛️</div>
                          <p className="text-sm">Chưa có hình ảnh</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Museum Info with Cards */}
              <div className="space-y-6">
                {/* Title and Categories */}
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent leading-tight">
                    {name}
                  </h1>
                  {renderCategories()}
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Rating Card */}
                  <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Star className="h-5 w-5 fill-primary text-primary" />
                      </div>
                      <div>
                        <div className="font-bold text-lg">{rating.toFixed(1)}</div>
                        <div className="text-xs text-muted-foreground">Đánh giá</div>
                      </div>
                    </div>
                  </div>

                  {/* Hours Card */}
                  <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-bold text-sm">08:00 - 17:00</div>
                        <div className="text-xs text-muted-foreground">Giờ mở cửa</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Info Cards */}
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 mt-0.5">
                        <MapPin className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{location}</div>
                        <div className="text-xs text-muted-foreground mt-1">Địa chỉ</div>
                      </div>
                    </div>
                  </div>

                  {(contactPhone || contactEmail) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {contactPhone && (
                        <div className="p-3 rounded-lg bg-muted/20 border border-border/30">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <a href={`tel:${contactPhone}`} className="text-sm hover:underline font-medium">
                              {contactPhone}
                            </a>
                          </div>
                        </div>
                      )}
                      {contactEmail && (
                        <div className="p-3 rounded-lg bg-muted/20 border border-border/30">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <a href={`mailto:${contactEmail}`} className="text-sm hover:underline font-medium">
                              {contactEmail}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Social Links */}
                {renderSocialLinks()}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Sections with Consistent Styling */}
      <div className="grid gap-6 lg:gap-8">
        {/* Description Section */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Giới thiệu</h2>
            </div>
            <div className="prose prose-lg max-w-none">
              {metadata?.contentHomePage ? (
                <div
                  className="text-muted-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: metadata.contentHomePage }}
                />
              ) : description ? (
                <p className="text-muted-foreground leading-relaxed text-lg">{description}</p>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📖</div>
                  <p className="text-muted-foreground italic text-lg">Chưa có thông tin giới thiệu</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        {metadata?.detail && (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Thông tin chi tiết</h2>
              </div>
              <div className="prose prose-lg max-w-none">
                <div
                  className="text-muted-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: metadata.detail }}
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
