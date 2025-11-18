package com.pinyourword.william.dto.request;

import java.util.List;

public record PinCreateRequest(
        String name,
        String notes,
        Short rating,
        String status,
        String visitDate, // ISO string từ form-data
        LocationRequest location
) {

    public record LocationRequest(
            String placeId,
            String licence,
            String osmType,
            long osmId,
            Double lat,
            Double lon,
            String clazz, // "class" là từ khóa trong Java, đổi tên
            String type,
            int placeRank,
            double importance,
            String addresstype,
            String displayName,
            Address address,
            List<String> boundingBox, // minLat, maxLat, minLon, maxLon
            String name
    ) {

        public record Address(
                String amenity,
                String houseNumber,
                String road,
                String suburb,
                String cityDistrict,
                String city,
                String state,
                String region,
                String iso3166_2_lvl4,
                String postcode,
                String country,
                String countryCode,
                String county
        ) {}
    }
}
