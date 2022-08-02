cmake_minimum_required(VERSION 3.22)
project(cubemap)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_compile_options(-Oz -msimd128)

add_link_options(
    -Oz -msimd128 
    -sEXPORTED_FUNCTIONS=_malloc,_free,_jsCubeMap
    -sEXPORTED_RUNTIME_METHODS=ccall 
    -sSINGLE_FILE -sALLOW_MEMORY_GROWTH
)


add_executable(test main.cpp)