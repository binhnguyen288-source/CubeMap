#pragma once
#include <cstdint>
#include <cmath>
#include <algorithm>
struct RGBA {
    std::uint8_t* data;
    int width, height;

    RGBA(int width, int height) : 
        data{new std::uint8_t[4 * width * height]}, 
        width{width}, height{height} {}
    
    RGBA(RGBA&& other) = delete;
    RGBA(RGBA const& other) = delete;
    RGBA& operator=(RGBA const& other) = delete;
    RGBA& operator=(RGBA&& other) = delete;

    ~RGBA() { delete[] data; }

    std::uint8_t const* getCPixel(int row, int col) const {
        row  = std::clamp(row, 0, height - 1);
        col %= width;
        return &data[4 * (row * width + col)];
    }
    
    std::uint8_t* getPixel(int row, int col) {
        row  = std::clamp(row, 0, height - 1);
        col %= width;
        return &data[4 * (row * width + col)];
    }
};

static const float pi = std::acos(-1);

struct Vec3D {
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
Vec3D mapsToSpherical(float a, float b) {
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

std::pair<float, float> mapsToCube(int face, float x, float y, float z) {
    switch (face) {
        case LEFT:
            return {(1 + y) / 2, (1 - z) / 2};
        case FRONT:
            return {(1 - x) / 2, (3 - z) / 2};
        case RIGHT:
            return {(1 - y) / 2, (5 - z) / 2};
        case BACK:
            return {(1 + x) / 2, (7 - z) / 2};
        case TOP:
            return {(1 - x) / 2, (9 + y) / 2};
        case BOTTOM:
            return {(1 - x) / 2, (11 - y) / 2};
    }
    return {0, 0};
}

template<Face face>
void toCubeMapFace(RGBA const& src, RGBA& dst) {
    const int nCubeSide = src.width / 4;
    const int offsetJ = face * nCubeSide;
    for (int j = 0; j < nCubeSide; ++j) {
        for (int i = 0; i < nCubeSide; ++i) {
            auto [x, y, z] = mapsToSpherical<face>(2.0f * i / nCubeSide - 1.0f, 2.0f * j / nCubeSide - 1.0f);
            float theta = std::atan2(y, x);
            theta += theta < 0 ? 2 * pi : 0;
            const float phi = std::atan2(std::sqrt(x * x + y * y), z);

            int srci = theta * src.width / (2 * pi);
            int srcj = phi * src.height / pi;

            std::copy_n(src.getCPixel(srcj, srci), 4, dst.getPixel(offsetJ + j, i));
        }
    }

}

RGBA* toCubeMap(RGBA const& src) {
    
    int nCubeSide = src.width / 4;
    RGBA* dst = new RGBA(nCubeSide, 6 * nCubeSide);
    toCubeMapFace<LEFT>(src, *dst);
    toCubeMapFace<FRONT>(src, *dst);
    toCubeMapFace<RIGHT>(src, *dst);
    toCubeMapFace<BACK>(src, *dst);
    toCubeMapFace<TOP>(src, *dst);
    toCubeMapFace<BOTTOM>(src, *dst);
    return dst;
}
