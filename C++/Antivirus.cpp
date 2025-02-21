#include "headers.h"

int Antivirus::startScanning(std::string filename)
{
    std::string reportfile = filename + ".report";
    fs::path current_path = fs::current_path();
    fs::path upload_directory = fs::current_path().parent_path() / "Backend/uploads";

    try
    {
        if (!fs::exists(upload_directory) || !fs::is_directory(upload_directory))
        {
            return 0;
        }

        fs::current_path(upload_directory);

        if (!Antivirus::searchFile(filename))
        {
            fs::current_path(current_path);
            return 0;
        }

        std::string command = "clamscan " + filename +
                              " | awk 'NR==1 { if ($NF == \"FOUND\") print $(NF-1), $NF; else print $NF }'" +
                              " | tee " + reportfile;

        if (system(command.c_str()) != 0)
        {
            fs::current_path(current_path);
            return 0;
        }
        fs::current_path(current_path);
        return 1;
    }
    catch (const std::exception &e)
    {
        fs::current_path(current_path);
        std::cerr << e.what() << '\n';
        return 0;
    }

    fs::current_path(current_path);
    return 0;
}

bool Antivirus::searchFile(std::string filename)
{
    for (auto &entry : fs::directory_iterator(fs::current_path()))
    {
        if (entry.path().filename() == filename)
        {
            return true;
        }
    }
    return false;
}