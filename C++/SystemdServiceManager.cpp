#include "headers.h"

bool SystemdServiceManager::sendMessage(const std::string &method, const std::vector<std::string> &args = {})
{
    DBusConnection* conn;
    DBusError err;
    dbus_error_init(&err);
    conn = dbus_bus_get(DBUS_BUS_SYSTEM, &err);
    if (!conn)
    {
        std::cerr << "Failed to connect to D-Bus: " << err.message << std::endl;
        dbus_error_free(&err);
        return false;
    }

    DBusMessage *msg = dbus_message_new_method_call(
        "org.freedesktop.systemd1",
        "/org/freedesktop/systemd1",
        "org.freedesktop.systemd1.Manager",
        method.c_str());

    if (!msg)
    {
        std::cerr << "Failed to create message." << std::endl;
        return false;
    }

    if (!args.empty())
    {
        for (const auto &arg : args)
        {
            const char *str_arg = arg.c_str();
            dbus_message_append_args(msg, DBUS_TYPE_STRING, &str_arg, DBUS_TYPE_INVALID);
        }
    }

    DBusMessage *reply = dbus_connection_send_with_reply_and_block(conn, msg, -1, &err);

    if (!reply)
    {
        std::cerr << "Failed to send message: " << err.message << std::endl;
        dbus_error_free(&err);
        dbus_message_unref(msg);
        return false;
    }

    dbus_message_unref(reply);
    dbus_message_unref(msg);
    dbus_connection_unref(conn);
    return true;
}

bool SystemdServiceManager::startService(const std::string &service)
{
    return sendMessage("StartUnit", {service + ".service", "replace"});
}

bool SystemdServiceManager::stopService(const std::string &service)
{
    return sendMessage("StopUnit", {service + ".service", "replace"});
}

bool SystemdServiceManager::restartService(const std::string &service)
{
    return sendMessage("RestartUnit", {service + ".service", "replace"});
}

bool SystemdServiceManager::enableService(const std::string &service)
{
    return sendMessage("EnableUnitFiles", {service + ".service", "false", "true"});
}

bool SystemdServiceManager::disableService(const std::string &service)
{
    return sendMessage("DisableUnitFiles", {service + ".service", "false"});
}