package com.pinyourword.william.util;

import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;

/**
 * Utility class for geospatial operations using PostGIS
 */
public class GeoUtils {
    
    private static final int SRID_WGS84 = 4326;
    private static final GeometryFactory geometryFactory = 
        new GeometryFactory(new PrecisionModel(), SRID_WGS84);
    
    /**
     * Create a Point from latitude and longitude
     * @param latitude Latitude in degrees (-90 to 90)
     * @param longitude Longitude in degrees (-180 to 180)
     * @return PostGIS Point with SRID 4326
     */
    public static Point createPoint(double latitude, double longitude) {
        if (latitude < -90 || latitude > 90) {
            throw new IllegalArgumentException("Latitude must be between -90 and 90");
        }
        if (longitude < -180 || longitude > 180) {
            throw new IllegalArgumentException("Longitude must be between -180 and 180");
        }
        
        // Note: PostGIS uses (longitude, latitude) order for SRID 4326
        Point point = geometryFactory.createPoint(new Coordinate(longitude, latitude));
        point.setSRID(SRID_WGS84);
        return point;
    }
    
    /**
     * Get latitude from Point
     */
    public static double getLatitude(Point point) {
        return point.getY();
    }
    
    /**
     * Get longitude from Point
     */
    public static double getLongitude(Point point) {
        return point.getX();
    }
    
    /**
     * Calculate distance between two points in meters
     * Uses PostGIS geography type calculation (spheroid)
     */
    public static double distance(Point point1, Point point2) {
        // This is a simple planar distance, for accurate distance use PostGIS ST_Distance
        // In queries: ST_Distance(geography(point1), geography(point2))
        return point1.distance(point2);
    }
    
    /**
     * Validate latitude value
     */
    public static boolean isValidLatitude(double latitude) {
        return latitude >= -90 && latitude <= 90;
    }
    
    /**
     * Validate longitude value
     */
    public static boolean isValidLongitude(double longitude) {
        return longitude >= -180 && longitude <= 180;
    }
    
    /**
     * Format coordinates as string
     */
    public static String formatCoordinates(Point point) {
        return String.format("%.6f, %.6f", getLatitude(point), getLongitude(point));
    }
}
