#include <cmath>
#include <iostream>
#include <vector>
#include <algorithm>
#include <cstdint>
#include <iostream>
using uchar = std::uint8_t;
struct RGBA {
    uchar* data;
    int width, height;

    RGBA(uchar* data, int width, int height) : 
        data{data}, width{width}, height{height} {}
    
    RGBA(RGBA&& other) = delete;
    RGBA(RGBA const& other) = delete;
    RGBA& operator=(RGBA const& other) = delete;
    RGBA& operator=(RGBA&& other) = delete;
    ~RGBA() = default;

    uchar const* getCPixel(int row, int col) const {
        row  = std::clamp(row, 0, height - 1);
        col %= width;
        return &data[4 * (row * width + col)];
    }
    
    uchar* getPixel(int row, int col) {
        row  = std::clamp(row, 0, height - 1);
        col %= width;
        return &data[4 * (row * width + col)];
    }
};

static const float pi = std::acos(-1);

struct Point3D {
    float x, y, z;
};


enum Face {
    LEFT,
    FRONT,
    RIGHT,
    BACK,
    TOP,
    BOTTOM
};

template<Face face>
Point3D mapsToSpherical(float a, float b) {
    if constexpr (face == LEFT)
        return {1, a, -b};
    if constexpr (face == FRONT)
        return {-a, 1, -b};
    if constexpr (face == RIGHT)
        return {-1, -a, -b};
    if constexpr (face == BACK)
        return {a, -1, -b};
    if constexpr (face == TOP)
        return {-a, b, 1};
    if constexpr (face == BOTTOM)
        return {-a, -b, -1};
}

template<Face face>
void toCubeMapFace(RGBA const& src, RGBA& dst) {
    const int nCubeSide = src.width / 4;
    const int offsetJ = face <  TOP ? nCubeSide : (face == TOP ? 0 : 2 * nCubeSide);
    const int offsetI = face >= TOP ? nCubeSide : (face * nCubeSide);


    for (int j = 0; j < nCubeSide; ++j) {
        for (int i = 0; i < nCubeSide; ++i) {
            auto [x, y, z] = mapsToSpherical<face>(2.0f * i / nCubeSide - 1.0f, 2.0f * j / nCubeSide - 1.0f);
            float theta = std::atan2(y, x);
            theta += theta < 0 ? 2 * pi : 0;
            const float phi = std::atan2(std::sqrt(x * x + y * y), z);

            int srci = theta * src.width / (2 * pi);
            int srcj = phi * src.height / pi;

            std::copy_n(src.getCPixel(srcj, srci), 4, dst.getPixel(offsetJ + j, offsetI + i));
        }
    }

}

void toCubeMap(RGBA const& src, RGBA& dst) {
    toCubeMapFace<LEFT>(src, dst);
    toCubeMapFace<FRONT>(src, dst);
    toCubeMapFace<RIGHT>(src, dst);
    toCubeMapFace<BACK>(src, dst);
    toCubeMapFace<TOP>(src, dst);
    toCubeMapFace<BOTTOM>(src, dst);
}

extern "C" int jsCubeMap(uchar* src_data, uchar* dst_data, int nWidth, int nHeight) {
    RGBA src(src_data, nWidth, nHeight);
    RGBA dst(dst_data, nWidth, 3 * nWidth / 4);
    std::copy_n(src_data, 4 * nWidth * nHeight, src.data);
    toCubeMap(src, dst);
    std::copy_n(dst.data, 3 * nWidth * nWidth, dst_data);
    return 0;
}