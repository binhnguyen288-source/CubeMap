#include "Utils.hpp"
#include <array>


extern "C" void jsCubeMap(std::uint8_t* src_data, std::uint8_t* dst_data, int nWidth, int nHeight) {
    
    const int nCubeSide = nWidth / 2;

    RGBA src(src_data, nWidth, nHeight);
    RGBA dst(dst_data, nCubeSide, 6 * nCubeSide);

    toCubeMapFace<LEFT>(src, dst);
    toCubeMapFace<FRONT>(src, dst);
    toCubeMapFace<RIGHT>(src, dst);
    toCubeMapFace<BACK>(src, dst);
    toCubeMapFace<TOP>(src, dst);
    toCubeMapFace<BOTTOM>(src, dst);

    
}