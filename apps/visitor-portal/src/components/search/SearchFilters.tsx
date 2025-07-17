'use client';

import { Badge } from '@musetrip360/ui-core/badge';
import { Button } from '@musetrip360/ui-core/button';
import { Card, CardContent, CardHeader, CardTitle } from '@musetrip360/ui-core/card';
import { Checkbox } from '@musetrip360/ui-core/checkbox';
import { Label } from '@musetrip360/ui-core/label';
import { RadioGroup, RadioGroupItem } from '@musetrip360/ui-core/radio-group';
import { Slider } from '@musetrip360/ui-core/slider';
import { Camera, Clock, DollarSign, Filter, MapPin, RotateCcw, Star, Users, Zap } from 'lucide-react';
import { useState } from 'react';

interface SearchFiltersProps {
  selectedCategory: string;
  selectedLocation: string;
  priceRange: number[];
  rating: number;
  onFilterChange: (filters: any) => void;
}

export function SearchFilters({
  selectedCategory,
  selectedLocation,
  priceRange,
  rating,
  onFilterChange,
}: SearchFiltersProps) {
  const [localFilters, setLocalFilters] = useState({
    category: selectedCategory,
    location: selectedLocation,
    priceRange: priceRange,
    rating: rating,
    features: [] as string[],
    openToday: false,
    hasVirtualTour: false,
    accessibility: false,
  });

  const categories = [
    { id: 'all', label: 'Tất cả', count: 156 },
    { id: 'art', label: 'Nghệ thuật', count: 45 },
    { id: 'history', label: 'Lịch sử', count: 38 },
    { id: 'science', label: 'Khoa học', count: 29 },
    { id: 'culture', label: 'Văn hóa', count: 22 },
    { id: 'nature', label: 'Tự nhiên', count: 18 },
    { id: 'technology', label: 'Công nghệ', count: 15 },
    { id: 'military', label: 'Quân sự', count: 12 },
  ];

  const locations = [
    { id: 'all', label: 'Toàn thế giới', count: 156 },
    { id: 'vietnam', label: 'Việt Nam', count: 45 },
    { id: 'france', label: 'Pháp', count: 28 },
    { id: 'uk', label: 'Anh', count: 25 },
    { id: 'usa', label: 'Mỹ', count: 22 },
    { id: 'germany', label: 'Đức', count: 18 },
    { id: 'italy', label: 'Ý', count: 15 },
    { id: 'japan', label: 'Nhật Bản', count: 12 },
  ];

  const features = [
    { id: 'virtual-tour', label: 'Tour ảo 360°', icon: Camera },
    { id: 'ar-vr', label: 'AR/VR', icon: Zap },
    { id: 'audio-guide', label: 'Hướng dẫn âm thanh', icon: Users },
    { id: 'interactive', label: 'Tương tác', icon: Users },
    { id: 'kids-friendly', label: 'Thân thiện với trẻ em', icon: Users },
    { id: 'wheelchair', label: 'Tiếp cận người khuyết tật', icon: Users },
  ];

  const handleFilterUpdate = (key: string, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleFeatureToggle = (featureId: string) => {
    const newFeatures = localFilters.features.includes(featureId)
      ? localFilters.features.filter((f) => f !== featureId)
      : [...localFilters.features, featureId];

    handleFilterUpdate('features', newFeatures);
  };

  const handleReset = () => {
    const resetFilters = {
      category: 'all',
      location: 'all',
      priceRange: [0, 100],
      rating: 0,
      features: [],
      openToday: false,
      hasVirtualTour: false,
      accessibility: false,
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="space-y-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Bộ lọc</h2>
        </div>
        <Button variant="ghost" size="sm" onClick={handleReset}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Đặt lại
        </Button>
      </div>

      {/* Category Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Danh mục
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <RadioGroup value={localFilters.category} onValueChange={(value) => handleFilterUpdate('category', value)}>
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <RadioGroupItem value={category.id} id={category.id} />
                <Label htmlFor={category.id} className="flex-1 flex items-center justify-between cursor-pointer">
                  <span>{category.label}</span>
                  <Badge variant="secondary" className="text-xs">
                    {category.count}
                  </Badge>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Location Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Vị trí
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <RadioGroup value={localFilters.location} onValueChange={(value) => handleFilterUpdate('location', value)}>
            {locations.map((location) => (
              <div key={location.id} className="flex items-center space-x-2">
                <RadioGroupItem value={location.id} id={location.id} />
                <Label htmlFor={location.id} className="flex-1 flex items-center justify-between cursor-pointer">
                  <span>{location.label}</span>
                  <Badge variant="secondary" className="text-xs">
                    {location.count}
                  </Badge>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Price Range Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Khoảng giá
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="px-2">
            <Slider
              value={localFilters.priceRange}
              onValueChange={(value) => handleFilterUpdate('priceRange', value)}
              max={100}
              min={0}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>Miễn phí</span>
              <span>€{localFilters.priceRange[1]}+</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
              Miễn phí
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
              €0 - €10
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
              €10 - €25
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
              €25+
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Rating Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Star className="h-4 w-4" />
            Đánh giá
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[5, 4, 3, 2, 1].map((stars) => (
            <div
              key={stars}
              className="flex items-center space-x-2 cursor-pointer hover:bg-muted/50 rounded p-1"
              onClick={() => handleFilterUpdate('rating', stars)}
            >
              <Checkbox checked={localFilters.rating === stars} onChange={() => handleFilterUpdate('rating', stars)} />
              <div className="flex items-center gap-1">
                {[...Array(stars)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
                {[...Array(5 - stars)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-gray-300" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">& lên</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Features Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Tính năng
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <div key={feature.id} className="flex items-center space-x-2">
                <Checkbox
                  id={feature.id}
                  checked={localFilters.features.includes(feature.id)}
                  onCheckedChange={() => handleFeatureToggle(feature.id)}
                />
                <Label htmlFor={feature.id} className="flex items-center gap-2 cursor-pointer">
                  <IconComponent className="h-4 w-4" />
                  {feature.label}
                </Label>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Additional Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Khác
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="open-today"
              checked={localFilters.openToday}
              onCheckedChange={(checked) => handleFilterUpdate('openToday', checked)}
            />
            <Label htmlFor="open-today" className="cursor-pointer">
              Mở cửa hôm nay
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="virtual-tour"
              checked={localFilters.hasVirtualTour}
              onCheckedChange={(checked) => handleFilterUpdate('hasVirtualTour', checked)}
            />
            <Label htmlFor="virtual-tour" className="cursor-pointer">
              Có tour ảo
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="accessibility"
              checked={localFilters.accessibility}
              onCheckedChange={(checked) => handleFilterUpdate('accessibility', checked)}
            />
            <Label htmlFor="accessibility" className="cursor-pointer">
              Hỗ trợ khuyết tật
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Apply Filters Button */}
      <Button className="w-full" size="lg">
        Áp dụng bộ lọc
      </Button>
    </div>
  );
}
