#include "Utils.hpp"

#include <array>


RGBA* curCubeMap = nullptr;
int nCubeSide = 0;

extern "C" std::uint8_t* jsCubeMap(std::uint8_t* src_data, std::uint8_t* dst_data, int nWidth, int nHeight) {
    
    RGBA* src = new RGBA(nWidth, nHeight);
    std::copy_n(src_data, 4 * nWidth * nHeight, src->data);
    delete curCubeMap;
    nCubeSide = nWidth / 4;
    curCubeMap = toCubeMap(*src);
    delete src;
    std::copy_n(curCubeMap->data, 4 * nCubeSide * 6 * nCubeSide, dst_data);
    return dst_data;
}


extern "C" std::uint8_t* viewerQuery(std::uint8_t* dst, int dstWidth, int dstHeight, float theta0, float phi0, float hfov) {

    float const aspectRatio = (float)dstHeight / dstWidth;
    float const f = std::tan(hfov / 2);
    float const vfov = 2 * std::atan(aspectRatio * f);
    float const incY = 2.0f * f / dstWidth;

    using std::cos;
    using std::sin;

    const float Rot[9] = {
        cos(phi0) * cos(theta0), -sin(theta0), -sin(phi0) * cos(theta0),
        cos(phi0) * sin(theta0), cos(theta0), -sin(phi0) * sin(theta0),
        sin(phi0), 0, cos(phi0)
    };



    for (int i = 0; i < dstHeight; ++i) {
        const float XonPlane = 1;
        const float YonPlane = -f; // initial Y
        const float ZonPlane = aspectRatio * f * (1.0f - 2.0f * i / dstHeight);
        
        float x = XonPlane * Rot[0] + YonPlane * Rot[1] + ZonPlane * Rot[2];
        float y = XonPlane * Rot[3] + YonPlane * Rot[4] + ZonPlane * Rot[5];
        float z = XonPlane * Rot[6] + YonPlane * Rot[7] + ZonPlane * Rot[8];

        for (int j = 0; j < dstWidth; ++j) {

            x += incY * Rot[1];
            y += incY * Rot[4];
            z += incY * Rot[7];

            // const float cphi = z / sqrt(x * x + y * y + z * z);
            // const float sphi = sqrt(x * x + y * y) / sqrt(x * x + y * y + z * z);

            // const float ctheta = x / sqrt(x * x + y * y);
            // const float stheta = y / sqrt(x * x + y * y);


            auto [srci, srcj] = mapsToCube(x, y, z);
            int ii = srci * nCubeSide;
            int jj = srcj * nCubeSide;

            std::copy_n(curCubeMap->getCPixel(jj, ii), 4, &dst[4 * (i * dstWidth + j)]);


        }
    }



    return dst;
}