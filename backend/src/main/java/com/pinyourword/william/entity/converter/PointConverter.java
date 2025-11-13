package com.pinyourword.william.entity.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;

/**
 * JPA Converter for PostGIS Point type
 * Converts between JTS Point and database geography(Point, 4326)
 */
@Converter(autoApply = true)
public class PointConverter implements AttributeConverter<Point, Point> {
    
    private static final int SRID = 4326; // WGS 84
    private static final GeometryFactory geometryFactory = 
        new GeometryFactory(new PrecisionModel(), SRID);
    
    @Override
    public Point convertToDatabaseColumn(Point point) {
        if (point == null) {
            return null;
        }
        point.setSRID(SRID);
        return point;
    }
    
    @Override
    public Point convertToEntityAttribute(Point point) {
        if (point == null) {
            return null;
        }
        point.setSRID(SRID);
        return point;
    }
    
    /**
     * Create a Point from latitude and longitude
     * @param latitude Latitude (-90 to 90)
     * @param longitude Longitude (-180 to 180)
     * @return JTS Point with SRID 4326
     */
    public static Point createPoint(double latitude, double longitude) {
        // PostGIS uses (longitude, latitude) order for SRID 4326
        Point point = geometryFactory.createPoint(new Coordinate(longitude, latitude));
        point.setSRID(SRID);
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
}
