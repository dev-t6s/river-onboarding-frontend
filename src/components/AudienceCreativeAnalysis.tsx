import React from "react";
import { Users, MapPin, Smartphone, Monitor, Tablet, User } from "lucide-react";

interface AudienceInteraction {
  ageGroup: string;
  gender: string;
  device: string;
  location: string;
  roas: number;
  ctr: number;
  cvr: number;
  spend: number;
}

export const AudienceCreativeAnalysis = ({
  data,
}: {
  data: AudienceInteraction[];
}) => {
  // Group data by different dimensions
  const groupByDimension = (dimension: keyof AudienceInteraction) => {
    const groups: Record<string, AudienceInteraction[]> = {};
    data.forEach((item) => {
      const key = item[dimension];
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    });
    return groups;
  };

  const ageGroups = groupByDimension("ageGroup");
  const genders = groupByDimension("gender");
  const devices = groupByDimension("device");
  const locations = groupByDimension("location");

  const calculateAverage = (items: AudienceInteraction[]) => {
    return {
      roas: items.reduce((sum, item) => sum + item.roas, 0) / items.length,
      ctr: items.reduce((sum, item) => sum + item.ctr, 0) / items.length,
      cvr: items.reduce((sum, item) => sum + item.cvr, 0) / items.length,
      spend: items.reduce((sum, item) => sum + item.spend, 0),
    };
  };

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case "mobile":
        return <Smartphone className="h-4 w-4" />;
      case "desktop":
        return <Monitor className="h-4 w-4" />;
      case "tablet":
        return <Tablet className="h-4 w-4" />;
      default:
        return <Smartphone className="h-4 w-4" />;
    }
  };

  const getGenderIcon = (gender: string) => {
    switch (gender.toLowerCase()) {
      case "male":
        return <User className="h-4 w-4 text-blue-500" />;
      case "female":
        return <User className="h-4 w-4 text-pink-500" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-white text-black rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold flex items-center mb-4">
        <Users className="h-5 w-5 mr-2 text-indigo-500" />
        Audience-Creative Interaction
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center">
            <Users className="h-4 w-4 mr-2 text-gray-500" />
            Age Group Performance
          </h4>
          <div className="space-y-3">
            {Object.entries(ageGroups)
              .sort(([a], [b]) => parseInt(a) - parseInt(b))
              .map(([ageGroup, items]) => {
                const avg = calculateAverage(items);
                return (
                  <div key={ageGroup}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{ageGroup}</span>
                      <span className="font-medium">
                        {avg.roas.toFixed(1)}x ROAS
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-green-500"
                        style={{
                          width: `${Math.min(avg.roas * 20, 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
            Top Locations
          </h4>
          <div className="space-y-3">
            {Object.entries(locations)
              .sort(([, a], [, b]) => {
                const avgA = calculateAverage(a);
                const avgB = calculateAverage(b);
                return avgB.roas - avgA.roas;
              })
              .slice(0, 5)
              .map(([location, items]) => {
                const avg = calculateAverage(items);
                return (
                  <div key={location} className="flex justify-between">
                    <span className="text-sm">{location}</span>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {avg.roas.toFixed(1)}x
                      </div>
                      <div className="text-xs text-gray-500">
                        ${avg.spend.toLocaleString()}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center">
            <Users className="h-4 w-4 mr-2 text-gray-500" />
            Gender Performance
          </h4>
          <div className="flex space-x-4">
            {Object.entries(genders).map(([gender, items]) => {
              const avg = calculateAverage(items);
              return (
                <div
                  key={gender}
                  className="flex-1 border rounded-lg p-3 text-center"
                >
                  <div className="flex justify-center mb-2">
                    {getGenderIcon(gender)}
                  </div>
                  <div className="text-sm font-medium">{gender}</div>
                  <div className="text-lg font-bold text-green-600">
                    {avg.roas.toFixed(1)}x
                  </div>
                  <div className="text-xs text-gray-500">
                    {avg.ctr.toFixed(1)}% CTR
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center">
            <Smartphone className="h-4 w-4 mr-2 text-gray-500" />
            Device Performance
          </h4>
          <div className="flex space-x-4">
            {Object.entries(devices)
              .sort(([, a], [, b]) => {
                const avgA = calculateAverage(a);
                const avgB = calculateAverage(b);
                return avgB.roas - avgA.roas;
              })
              .map(([device, items]) => {
                const avg = calculateAverage(items);
                return (
                  <div
                    key={device}
                    className="flex-1 border rounded-lg p-3 text-center"
                  >
                    <div className="flex justify-center mb-2">
                      {getDeviceIcon(device)}
                    </div>
                    <div className="text-sm font-medium">{device}</div>
                    <div className="text-lg font-bold text-green-600">
                      {avg.roas.toFixed(1)}x
                    </div>
                    <div className="text-xs text-gray-500">
                      {avg.ctr.toFixed(1)}% CTR
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      <div className="mt-6 text-xs text-gray-500">
        Performance metrics segmented by audience demographics and device types
      </div>
    </div>
  );
};
