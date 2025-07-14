'use client';

import { Card, CardContent, CardHeader } from '@musetrip360/ui-core/card';
import { Badge } from '@musetrip360/ui-core/badge';
import { Button } from '@musetrip360/ui-core/button';
import { MapPin, Star, Clock, Users, Calendar, Heart, Share2, ArrowRight } from 'lucide-react';

interface Museum {
  id: number;
  name: string;
  category: string;
  location: string;
  rating: number;
  reviewCount: number;
  price: string;
  image: string;
  description: string;
  features: string[];
  openHours: string;
  established: string;
}

interface SearchResultsProps {
  museums: Museum[];
  currentPage: number;
  resultsPerPage: number;
}

export function SearchResults({ museums, currentPage, resultsPerPage }: SearchResultsProps) {
  const startIndex = (currentPage - 1) * resultsPerPage;
  const endIndex = startIndex + resultsPerPage;
  const currentMuseums = museums.slice(startIndex, endIndex);

  const handleFavorite = (museumId: number) => {
    // TODO: Implement favorite functionality
    console.log('Toggle favorite for museum:', museumId);
  };

  const handleShare = (museumId: number) => {
    // TODO: Implement share functionality
    console.log('Share museum:', museumId);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${index < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  if (currentMuseums.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto max-w-md">
          <div className="mx-auto h-24 w-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <MapPin className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Không tìm thấy bảo tàng nào</h3>
          <p className="text-muted-foreground mb-4">Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm của bạn</p>
          <Button variant="outline">Xóa bộ lọc</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {currentMuseums.map((museum) => (
          <Card key={museum.id} className="group overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="relative">
              <img
                src={museum.image}
                alt={museum.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Action Buttons */}
              <div className="absolute top-3 right-3 flex gap-2">
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8 bg-white/80 backdrop-blur-sm hover:bg-white"
                  onClick={() => handleFavorite(museum.id)}
                >
                  <Heart className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8 bg-white/80 backdrop-blur-sm hover:bg-white"
                  onClick={() => handleShare(museum.id)}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Category Badge */}
              <Badge variant="secondary" className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm">
                {museum.category}
              </Badge>

              {/* Price Badge */}
              <Badge variant="default" className="absolute bottom-3 right-3 bg-primary/90 backdrop-blur-sm">
                {museum.price}
              </Badge>
            </div>

            <CardHeader className="pb-3">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                  {museum.name}
                </h3>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span className="line-clamp-1">{museum.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{museum.established}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">{renderStars(museum.rating)}</div>
                  <span className="text-sm font-medium">{museum.rating}</span>
                  <span className="text-sm text-muted-foreground">({museum.reviewCount} đánh giá)</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">{museum.description}</p>

                {/* Features */}
                <div className="flex flex-wrap gap-1">
                  {museum.features.slice(0, 3).map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                  {museum.features.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{museum.features.length - 3} khác
                    </Badge>
                  )}
                </div>

                {/* Opening Hours */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{museum.openHours}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Users className="h-4 w-4 mr-2" />
                    Tour ảo
                  </Button>
                  <Button size="sm" className="flex-1">
                    Xem chi tiết
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Results Summary */}
      <div className="text-center py-4 border-t">
        <p className="text-sm text-muted-foreground">
          Hiển thị {startIndex + 1} - {Math.min(endIndex, museums.length)} của {museums.length} bảo tàng
        </p>
      </div>
    </div>
  );
}
