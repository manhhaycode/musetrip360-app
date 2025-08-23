import { Ionicons } from '@expo/vector-icons';
import { Image, Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Museum } from '../types/api';

interface MuseumDetailProps {
  museum: Museum;
}

export function MuseumDetail({ museum }: MuseumDetailProps) {
  const { name, description, location, contactPhone, contactEmail, rating, metadata, categories } = museum;

  const handlePhonePress = () => {
    if (contactPhone) {
      Linking.openURL(`tel:${contactPhone}`);
    }
  };

  const handleEmailPress = () => {
    if (contactEmail) {
      Linking.openURL(`mailto:${contactEmail}`);
    }
  };

  const handleWebsitePress = () => {
    if (metadata?.socialLinks?.website) {
      Linking.openURL(metadata.socialLinks.website);
    }
  };

  const renderImages = () => {
    if (!metadata?.images || metadata.images.length === 0) return null;

    return (
      <View className="mb-6">
        <Text className="text-lg font-semibold text-gray-900 mb-3">Hình ảnh bảo tàng</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="space-x-3">
          {metadata.images.map((imageUrl, index) => (
            <Image key={index} source={{ uri: imageUrl }} className="w-48 h-32 rounded-lg" resizeMode="cover" />
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderContactInfo = () => (
    <View className="mb-6">
      <Text className="text-lg font-semibold text-gray-900 mb-3">Thông tin liên hệ</Text>
      <View className="space-y-3">
        {/* Address */}
        <View className="flex-row items-start space-x-3 p-3 bg-gray-50 rounded-lg">
          <Ionicons name="location-outline" size={20} color="#6B7280" />
          <View className="flex-1">
            <Text className="text-sm font-medium text-gray-900">Địa chỉ</Text>
            <Text className="text-sm text-gray-600 mt-1">{location}</Text>
          </View>
        </View>

        {/* Phone */}
        {contactPhone && (
          <TouchableOpacity
            onPress={handlePhonePress}
            className="flex-row items-center space-x-3 p-3 bg-gray-50 rounded-lg"
          >
            <Ionicons name="call-outline" size={20} color="#6B7280" />
            <View className="flex-1">
              <Text className="text-sm font-medium text-gray-900">Số điện thoại</Text>
              <Text className="text-sm text-blue-600 mt-1">{contactPhone}</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Email */}
        {contactEmail && (
          <TouchableOpacity
            onPress={handleEmailPress}
            className="flex-row items-center space-x-3 p-3 bg-gray-50 rounded-lg"
          >
            <Ionicons name="mail-outline" size={20} color="#6B7280" />
            <View className="flex-1">
              <Text className="text-sm font-medium text-gray-900">Email</Text>
              <Text className="text-sm text-blue-600 mt-1">{contactEmail}</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Website */}
        {metadata?.socialLinks?.website && (
          <TouchableOpacity
            onPress={handleWebsitePress}
            className="flex-row items-center space-x-3 p-3 bg-gray-50 rounded-lg"
          >
            <Ionicons name="globe-outline" size={20} color="#6B7280" />
            <View className="flex-1">
              <Text className="text-sm font-medium text-gray-900">Website</Text>
              <Text className="text-sm text-blue-600 mt-1">{metadata.socialLinks.website}</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderStats = () => (
    <View className="mb-6">
      <Text className="text-lg font-semibold text-gray-900 mb-3">Thông tin chung</Text>
      <View className="flex-row space-x-4">
        {/* Rating */}
        <View className="flex-1 p-4 bg-orange-50 rounded-lg border border-orange-200">
          <View className="flex-row items-center space-x-2">
            <Ionicons name="star" size={20} color="#F59E0B" />
            <Text className="text-lg font-bold text-gray-900">{rating.toFixed(1)}</Text>
          </View>
          <Text className="text-xs text-gray-600 mt-1">Đánh giá</Text>
        </View>

        {/* Status */}
        <View className="flex-1 p-4 bg-green-50 rounded-lg border border-green-200">
          <View className="flex-row items-center space-x-2">
            <Ionicons
              name={museum.status === 'Active' ? 'checkmark-circle' : 'time'}
              size={20}
              color={museum.status === 'Active' ? '#10B981' : '#F59E0B'}
            />
            <Text className="text-sm font-medium text-gray-900">
              {museum.status === 'Active' ? 'Hoạt động' : 'Tạm ngưng'}
            </Text>
          </View>
          <Text className="text-xs text-gray-600 mt-1">Trạng thái</Text>
        </View>
      </View>
    </View>
  );

  const renderCategories = () => {
    if (!categories || categories.length === 0) return null;

    return (
      <View className="mb-6">
        <Text className="text-lg font-semibold text-gray-900 mb-3">Danh mục bảo tàng</Text>
        <View className="flex-row flex-wrap gap-2">
          {categories.map((category) => (
            <View key={category.id} className="px-3 py-1 bg-blue-100 rounded-full">
              <Text className="text-sm text-blue-800 font-medium">{category.name}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderIntroduction = () => {
    const introContent = metadata?.detail || metadata?.contentHomePage;
    if (!introContent) return null;

    return (
      <View className="mb-6">
        <Text className="text-lg font-semibold text-gray-900 mb-3">Giới thiệu</Text>
        <View className="p-4 bg-gray-50 rounded-lg">
          <Text className="text-sm text-gray-700 leading-6">{introContent}</Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-4">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-900 mb-2">{name}</Text>
          <Text className="text-sm text-gray-600 leading-5">{description}</Text>
        </View>

        {/* Cover Image */}
        {metadata?.coverImageUrl && (
          <View className="mb-6">
            <Image source={{ uri: metadata.coverImageUrl }} className="w-full h-48 rounded-lg" resizeMode="cover" />
          </View>
        )}

        {/* Stats */}
        {renderStats()}

        {/* Introduction */}
        {renderIntroduction()}

        {/* Contact Info */}
        {renderContactInfo()}

        {/* Categories */}
        {renderCategories()}

        {/* Images */}
        {renderImages()}
      </View>
    </ScrollView>
  );
}
