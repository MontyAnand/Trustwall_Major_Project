#include "headers.h"

void QR::write_png(const char *filename, unsigned char *data, int width, int height)
{
    FILE *fp = fopen(filename, "wb");
    if (!fp)
        throw std::runtime_error("Failed to open file for writing PNG");

    png_structp png = png_create_write_struct(PNG_LIBPNG_VER_STRING, nullptr, nullptr, nullptr);
    if (!png)
        throw std::runtime_error("Failed to create PNG write struct");

    png_infop info = png_create_info_struct(png);
    if (!info)
        throw std::runtime_error("Failed to create PNG info struct");

    if (setjmp(png_jmpbuf(png)))
        throw std::runtime_error("Error during PNG creation");

    png_init_io(png, fp);
    png_set_IHDR(png, info, width, height, 8, PNG_COLOR_TYPE_GRAY, PNG_INTERLACE_NONE, PNG_COMPRESSION_TYPE_DEFAULT, PNG_FILTER_TYPE_DEFAULT);
    png_write_info(png, info);

    for (int y = 0; y < height; y++)
    {
        png_write_row(png, data + y * width);
    }

    png_write_end(png, nullptr);
    png_destroy_write_struct(&png, &info);
    fclose(fp);
}

std::string QR::file_to_base64(const std::string &filename)
{
    std::ifstream file(filename, std::ios::binary);
    std::ostringstream oss;
    std::vector<unsigned char> buffer(std::istreambuf_iterator<char>(file), {});
    static const char encode_table[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    int val = 0, valb = -6;
    for (unsigned char c : buffer)
    {
        val = (val << 8) + c;
        valb += 8;
        while (valb >= 0)
        {
            oss << encode_table[(val >> valb) & 0x3F];
            valb -= 6;
        }
    }
    if (valb > -6)
        oss << encode_table[((val << 8) >> (valb + 8)) & 0x3F];
    while (oss.str().size() % 4)
        oss << '=';
    return oss.str();
}

// Generate and save QR code as PNG, then encode to base64

std::string QR::generate_qr_base64(const std::string &text, int scale)
{
    QRcode *qrcode = QRcode_encodeString(text.c_str(), 0, QR_ECLEVEL_L, QR_MODE_8, 1);
    if (!qrcode)
        throw std::runtime_error("Failed to encode QR code");

    int width = qrcode->width * scale;
    std::vector<unsigned char> image_data(width * width, 255); // White background

    for (int y = 0; y < qrcode->width; y++)
    {
        for (int x = 0; x < qrcode->width; x++)
        {
            for (int i = 0; i < scale; i++)
            {
                for (int j = 0; j < scale; j++)
                {
                    image_data[(y * scale + i) * width + (x * scale + j)] = (qrcode->data[y * qrcode->width + x] & 1) ? 0 : 255;
                }
            }
        }
    }

    std::string filename = "qrcode.png";
    write_png(filename.c_str(), image_data.data(), width, width);

    QRcode_free(qrcode);

    // Convert to base64
    return file_to_base64(filename);
}