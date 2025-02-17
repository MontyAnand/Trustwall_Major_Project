#include "headers.h"

std::string Authentication::authenticateUser(std::string & userID, std::string & password){
    struct passwd *pwd = getpwnam(userID.c_str());

    if(! pwd){
        std::cerr << "User doesn't exists.\n";
        return Authentication::authResponseJSON(0,"User does not exixts",userID);
    }

    struct spwd *sp = getspnam(userID.c_str());

    if(! sp){
        std::cerr << "Not Authorized to access shadow file\n";
        return Authentication::authResponseJSON(0,"Server side error",userID);
    }

    // Hash the input password using the stored salt

    char *encrypted = crypt(password.c_str(), sp->sp_pwdp);

    if (!encrypted) {
        std::cerr << "Error in password encryption.\n";
        return Authentication::authResponseJSON(0,"Server side error",userID);
    }

    // Compare the stored and input password hashes

    if (std::string(encrypted) == std::string(sp->sp_pwdp)) {
        return Authentication::authResponseJSON(1,"Successfully Authenticated",userID);
    } else {
        std::cerr << "Invalid password.\n";
        return Authentication::authResponseJSON(0,"Invalid Password",userID);
    }
}

std::string Authentication::authResponseJSON(int status, std::string message, std::string &userID){
    json data = {
        {"status", status},
        {"message", message},
        {"userId",userID}
    };
    return data.dump();
}