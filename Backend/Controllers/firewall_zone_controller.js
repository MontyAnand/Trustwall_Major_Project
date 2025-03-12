const { runCommand } = require('./runCommand')
const { reloadFirewall } = require('./firewall_controller');

// Zone information

module.exports.getZones = (req, res) => {
    runCommand('sudo firewall-cmd --get-zones', res);
}

module.exports.getZonesInfo = (req, res) => {
    runCommand('sudo firewall-cmd --list-all-zones', res);
}

module.exports.getZoneInfo = (req, res) => {
    const { zone } = req.body;
    const cmd = `sudo firewall-cmd --zone=${zone} --list-all`;
    runCommand(cmd, res);
}

module.exports.getDefaultZone = (req, res) => {
    runCommand('sudo firewall-cmd --get-default-zone', res);
}

module.exports.setDefaultZone = (req, res) => {
    const { zone } = req.body;
    const cmd = `sudo firewall-cmd --set-default-zone=${zone}`;
    runCommand(cmd, res);
}

module.exports.getActiveZones = (req, res) => {
    runCommand('sudo firewall-cmd --get-active-zones', res);
}

module.exports.loadDefaultSettingsZone = (req, res) => {
    const { zone } = req.body;
    const cmd = `sudo firewall-cmd --permanent --load-zone-defaults=${zone}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.getPathZone = (req, res) => {
    const { zone } = req.body;
    const cmd = `sudo firewall-cmd --permanent --path-zone=${zone}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

// target

module.exports.getTarget = (req, res) => {
    const { zone } = req.body;
    const cmd = `sudo firewall-cmd --permanent --zone=${zone} --get-target`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.setTarget = (req, res) => {
    const { zone, target } = req.body;
    const cmd = `sudo firewall-cmd --permanent --zone=${zone} --set-target=${target}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

// description

module.exports.getDescription = (req, res) => {
    const { zone } = req.body;
    const cmd = `sudo firewall-cmd --permanent --zone=${zone} --get-description`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.setDescription = (req, res) => {
    const { zone, description } = req.body;
    const cmd = `sudo firewall-cmd --permanent --zone=${zone} --set-description=${description}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

// short

module.exports.getShort = (req, res) => {
    const { zone } = req.body;
    const cmd = `sudo firewall-cmd --permanent --zone=${zone} --get-short`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.setShort = (req, res) => {
    const { zone, short } = req.body;
    const cmd = `sudo firewall-cmd --permanent --zone=${zone} --set-short=${short}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

// icmp-block-inversion

module.exports.queryICMPBlockInversion = (req, res) => {
    const { zone } = req.body;
    const cmd = `sudo firewall-cmd --permanent --zone=${zone} --query-icmp-block-inversion`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.addICMPBlockInversion = (req, res) => {
    const { zone } = req.body;
    const cmd = `sudo firewall-cmd --permanent --zone=${zone} --add-icmp-block-inversion`; 
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.removeICMPBlockInversion = (req, res) => {
    const { zone } = req.body;
    const cmd = `sudo firewall-cmd --permanent --zone=${zone} --remove-icmp-block-inversion`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

// forward

module.exports.queryForward = (req, res) => {
    const { zone } = req.body;
    const cmd = `sudo firewall-cmd --permanent --zone=${zone} --query-forward`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.addForward = (req, res) => {
    const { zone } = req.body;
    const cmd = `sudo firewall-cmd --permanent --zone=${zone} --add-forward`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.removeForward = (req, res) => {
    const { zone } = req.body;
    const cmd = `sudo firewall-cmd --permanent --zone=${zone} --remove-forward`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

// interfaces

module.exports.listInterfaces = (req, res) => {
    const { zone } = req.body;
    const cmd = `sudo firewall-cmd --permanent --zone=${zone} --list-interfaces`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.queryInterface = (req, res) => {
    const { zone, interface } = req.body;
    const cmd = `sudo firewall-cmd --permanent --zone=${zone} --query-interface=${interface}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.addInterface = (req, res) => {
    const { zone, interface } = req.body;
    const cmd = `sudo firewall-cmd --permanent --zone=${zone} --add-interface=${interface}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.changeInterface = (req, res) => {
    const { zone, interface } = req.body;
    const cmd = `sudo firewall-cmd --permanent --zone=${zone} --change-interface=${interface}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.removeInterface = (req, res) => {
    const { interface } = req.body;
    const cmd = `sudo firewall-cmd --permanent --remove-interface=${interface}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.getZoneOfInterface = (req, res) => {
    const { interface } = req.body;
    const cmd = `sudo firewall-cmd --get-zone-of-interface=${interface}`;
    runCommand(cmd, res);
}

// sources

module.exports.listSources = (req, res) => {
    const { zone } = req.body;
    const cmd = `sudo firewall-cmd --permanent --zone=${zone} --list-sources`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.querySource = (req, res) => {
    const { zone, source } = req.body;
    const cmd = `sudo firewall-cmd --permanent --zone=${zone} --query-source=${source}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.addSource = (req, res) => {
    const { zone, source } = req.body;
    const cmd = `sudo firewall-cmd --permanent --zone=${zone} --add-source=${source}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.changeSource = (req, res) => {
    const { zone } = req.body;
    const cmd = `sudo firewall-cmd --zone=${zone} --change-source=${source}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.removeSource = (req, res) => {
    const { source } = req.body;
    const cmd = `sudo firewall-cmd --permanent --remove-source=${source}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.getZoneOfSource = (req, res) => {
    const { source } = req.body;
    const cmd = `sudo firewall-cmd --get-zone-of-source=${source}`;
    runCommand(cmd, res);
}

// services

module.exports.listServices = (req, res) => {
    const { zone } = req.body;
    const cmd = `sudo firewall-cmd --permanent --zone=${zone} --list-services`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.queryService = (req, res) => {
    const { zone, service } = req.body;
    const cmd = `sudo firewall-cmd --permanent --zone=${zone} --query-service=${service}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.addService = (req, res) => {
    const { zone, service } = req.body;
    const cmd = `sudo firewall-cmd --permanent --zone=${zone} --add-service=${service}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.removeService = (req, res) => {
    const { zone, service } = req.body;
    const cmd = `sudo firewall-cmd --permanent --zone=${zone} --remove-service=${service}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

// ports

module.exports.listPorts = (req, res) => {
    const { zone } = req.body;
    const cmd = `sudo firewall-cmd --permanent --zone=${zone} --list-ports`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.queryPort = (req, res) => {
    const { zone, port, protocol } = req.body;
    const cmd = `sudo firewall-cmd --permanent --zone=${zone} --query-port=${port}/${protocol}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.addPort = (req, res) => {
    const { zone, port, protocol } = req.body;
    const cmd = `sudo fireall-cmd --permanent --zone=${zone} --add-port=${port}/${protocol}`;
    runCommand(cmd, run);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.removePort = (req, res) => {
    const { zone, port, protocol } = req.body;
    const cmd = `sudo firewall-cmd --permanent --zone=${zone} --remove-port=${port}/${protocol}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

// protocols

module.exports.listProtocols = (req, res) => {
    const { zone } = req.body;
    const cmd = `sudo firewall-cmd --permanent --zone=${zone} --list-protocols`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.queryProtocol = (req, res) => {
    const { zone, protocol } = req.body;
    const cmd = `sudo firewall-cmd --permanent --zone=${zone} --query-protocol=${protocol}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.addProtocol = (req, res) => {
    const { zone, protocol } = req.body;
    const cmd = `sudo firewall-cmd --permanent --zone=${zone} --add-protocol=${protocol}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.removeProtocol = (req, res) => {
    const { zone, protocol } = req.body;
    const cmd = `sudo firewall-cmd --permanent --zone=${zone} --remove-protocol=${protocol}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

// source ports

module.exports.listSourcePorts = (req, res) => {
    const { zone } = req.body;
    const cmd = `sudo firewall-cmd --permanent --zone=${zone} --list-source-ports`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.querySourcePort = (req, res) => {
    const { zone, port, protocol } = req.body;
    const cmd = `sudo firewall-cmd --permanent --zone=${zone} --query-source-port=${port}/${protocol}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.addSourcePort = (req, res) => {
    const { zone, port, protocol } = req.body;
    const cmd = `sudo firewall-cmd --permanent --zone=${zone} --add-source-port=${port}/${protocol}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.removeSourcePort = (req, res) => {
    const { zone, port, protocol } = req.body;
    const cmd = `sudo firewall-cmd --permanent --zone=${zone} --remove-source-port=${port}/${protocol}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

// icmptypes

module.exports.listICMPBlocks = (req, res) => {
    const { zone } = req.body;
    const cmd = `sudo firewall-cmd --permanent --zone=${zone} --list-icmp-blocks`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.queryICMPBlock = (req, res) => {
    const { zone, icmptype } = req.body;
    const cmd = `sudo firewall-cmd --permanent --zone=${zone} --query-icmp-block=${icmptype}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.addICMPBlock = (req, res) => {
    const { zone, icmptype } = req.body;
    const cmd = `sudo firewall-cmd --permanent --zone=${zone} --add-icmp-block=${icmptype}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.removeICMPBlock = (req, res) => {
    const { zone, icmptype } = req.body;
    const cmd = `sudo firewall-cmd --permanent --zone=${zone} --remove-icmp-block=${icmptype}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

// forward ports

module.exports.listForwardPorts = (req, res) => {
    const { zone } = req.body;
    const cmd = `sudo firewall-cmd --permanent --zone=${zone} --list-forward-ports`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.queryForwardPort = (req, res) => {
    const { zone, port, protocol, toPort, toAddress } = req.body;
    if(toPort && toAddress) {
        const cmd = `sudo firewall-cmd --permanent --zone=${zone} --query-forward-port=port=${port}:proto=${protocol}:toport=${toPort}:toaddr=${toAddress}`;
        runCommand(cmd, res);
    }
    else if(toPort && !toAddress) {
        const cmd = `sudo firewall-cmd --permanent --zone=${zone} --query-forward-port=port=${port}:proto=${protocol}:toport=${toPort}`;
        runCommand(cmd, res);
    }
    else if(!toPort && toAddress) {
        const cmd = `sudo firewall-cmd --permanent --zone=${zone} --query-forward-port=port=${port}:proto=${protocol}:toaddr=${toAddress}`;
        runCommand(cmd, res);
    }
    else {
        const cmd = `sudo firewall-cmd --permanent --zone-${zone} --query-forward-port=port=${port}:proto=${protocol}`;
        runCommand(cmd, res);
    }
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.addForwardPort = (req, res) => {
    const { zone, port, protocol, toPort, toAddress } = req.body;
    if(toPort && toAddress) {
        const cmd = `sudo firewall-cmd --permanent --zone=${zone} --add-forward-port=port=${port}:proto=${protocol}:toport=${toPort}:toaddr=${toAddress}`;
        runCommand(cmd, res);
    }
    else if(toPort && !toAddress) {
        const cmd = `sudo firewall-cmd --permanent --zone=${zone} --add-forward-port=port=${port}:proto=${protocol}:toport=${toPort}`;
        runCommand(cmd, res);
    }
    else if(!toPort && toAddress) {
        const cmd = `sudo firewall-cmd --permanent --zone=${zone} --add-forward-port=port=${port}:proto=${protocol}:toaddr=${toAddress}`;
        runCommand(cmd, res);
    }
    else {
        const cmd = `sudo firewall-cmd --permanent --zone-${zone} --add-forward-port=port=${port}:proto=${protocol}`;
        runCommand(cmd, res);
    }
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.removeForwardPort = (req, res) => {
    const { zone, port, protocol, toPort, toAddress } = req.body;
    if(toPort && toAddress) {
        const cmd = `sudo firewall-cmd --permanent --zone=${zone} --remove-forward-port=port=${port}:proto=${protocol}:toport=${toPort}:toaddr=${toAddress}`;
        runCommand(cmd, res);
    }
    else if(toPort && !toAddress) {
        const cmd = `sudo firewall-cmd --permanent --zone=${zone} --remove-forward-port=port=${port}:proto=${protocol}:toport=${toPort}`;
        runCommand(cmd, res);
    }
    else if(!toPort && toAddress) {
        const cmd = `sudo firewall-cmd --permanent --zone=${zone} --remove-forward-port=port=${port}:proto=${protocol}:toaddr=${toAddress}`;
        runCommand(cmd, res);
    }
    else {
        const cmd = `sudo firewall-cmd --permanent --zone-${zone} --remove-forward-port=port=${port}:proto=${protocol}`;
        runCommand(cmd, res);
    }
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

// masquerade(NAT)

module.exports.queryMasquerade = (req, res) => {
    const { zone } = req.body;
    const cmd = `sudo firewall-cmd --permanent --zone=${zone} --query-masquerade`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.addMasquerade = (req, res) => {
    const { zone } = req.body;
    const cmd = `sudo firewall-cmd --permanent --zone=${zone} --add-masquerade`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.removeMasquerade = (req, res) => {
    const { zone } = req.body;
    const cmd = `sudo firewall-cmd --permanent --zone=${zone} --remove-masquerade`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

// rich rules

module.exports.listRichRules = (req, res) => {
    const { zone } = req.body;
    const cmd = `sudo firewall-cmd --permanent --zone=${zone} --list-rich-rules`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.queryRichRule = (req, res) => {
    const { zone, rule } = req.body;
    const { family, source, destination, service, port, protocol, icmpblock, icmptype, masquerade, forwardport, log, nflog, audit, accept, reject, drop, mark } = rule;
    let cmd = `sudo firewall-cmd --permanent --zone=${zone} --query-rich-rule='rule`;
    if(family) cmd += ` family="${family}"`;
    if(source) {
        cmd += ` source address="${source.address}"`
        if(source.invert) cmd += ` invert="True"`;
    }
    if(destination) {
        cmd += ` destination address="${destination.address}"`
        if(destination.invert) cmd += ` invert="True"`;
    }
    if(service) cmd += ` service name="${service.name}"`;
    if(port) cmd += ` port port="${port.port}" protocol="${port.protocol}"`;
    if(protocol) cmd += ` protocol value="${protocol.value}"`;
    if(icmpblock) cmd += ` icmp-block name="${icmpblock.name}"`;
    if(icmptype) cmd += ` icmp-type name="${icmptype.name}"`;
    if(masquerade) cmd += ` masquerade`;
    if(forwardport) {
        cmd += ` forward-port port="${forwardport.port}" protocol="${forwardport.protocol}"`;
        if(forwardport.toport) cmd += ` to-port="${forwardport.toport}"`;
        if(forwardport.toaddr) cmd += ` to-addr="${forwardport.toaddr}"`;
    }
    if(log) {
        cmd += ` log`;
        if(log.prefix) cmd += ` prefix="${log.prefix}"`;
        if(log.level) cmd += ` level="${log.level}"`;
        if(log.limit) cmd += ` limit value="${log.limit.value}"`;
    }
    if(nflog) {
        cmd += ` nflog`;
        if(nflog.group) cmd += ` group="${nflog.group}"`;
        if(nflog.prefix) cmd += ` prefix="${nflog.prefix}"`;
        if(nflog.queuesize) cmd += ` queue-size="${nflog.queuesize}"`;
        if(nflog.limit) cmd += ` limit value="${nflog.limit.value}"`;
    }
    if(audit) {
        cmd += ` audit`;
        if(audit.limit) cmd += ` limit value="${audit.limit.value}"`;
    }
    if(accept) {
        cmd += ` accept`;
        if(accept.limit) cmd += ` limit value="${accept.limit.value}"`;
        cmd += `'`;
    }
    if(reject) {
        cmd += ` reject`;
        if(reject.type) cmd += ` type="${reject.type}"`;
        if(reject.limit) cmd += ` limit value="${reject.limit.value}"`;
        cmd += `'`;
    }
    if(drop) {
        cmd += ` drop`;
        if(drop.limit) cmd += ` limit value="${drop.limit.value}"`;
        cmd += `'`;
    }
    if(mark) {
        cmd += ' mark';
        if(mark.set) cmd += ` set="${mark.set}"`;
        if(mark.limit) cmd += ` limit value="${mark.limit.value}"`;
        cmd += `'`;
    }
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.addRichRule = (req, res) => {
    const { zone, rule } = req.body;
    const { family, source, destination, service, port, protocol, icmpblock, icmptype, masquerade, forwardport, log, nflog, audit, accept, reject, drop, mark } = rule;
    let cmd = `sudo firewall-cmd --permanent --zone=${zone} --add-rich-rule='rule`;
    if(family) cmd += ` family="${family}"`;
    if(source) {
        cmd += ` source address="${source.address}"`
        if(source.invert) cmd += ` invert="True"`;
    }
    if(destination) {
        cmd += ` destination address="${destination.address}"`
        if(destination.invert) cmd += ` invert="True"`;
    }
    if(service) cmd += ` service name="${service.name}"`;
    if(port) cmd += ` port port="${port.port}" protocol="${port.protocol}"`;
    if(protocol) cmd += ` protocol value="${protocol.value}"`;
    if(icmpblock) cmd += ` icmp-block name="${icmpblock.name}"`;
    if(icmptype) cmd += ` icmp-type name="${icmptype.name}"`;
    if(masquerade) cmd += ` masquerade`;
    if(forwardport) {
        cmd += ` forward-port port="${forwardport.port}" protocol="${forwardport.protocol}"`;
        if(forwardport.toport) cmd += ` to-port="${forwardport.toport}"`;
        if(forwardport.toaddr) cmd += ` to-addr="${forwardport.toaddr}"`;
    }
    if(log) {
        cmd += ` log`;
        if(log.prefix) cmd += ` prefix="${log.prefix}"`;
        if(log.level) cmd += ` level="${log.level}"`;
        if(log.limit) cmd += ` limit value="${log.limit.value}"`;
    }
    if(nflog) {
        cmd += ` nflog`;
        if(nflog.group) cmd += ` group="${nflog.group}"`;
        if(nflog.prefix) cmd += ` prefix="${nflog.prefix}"`;
        if(nflog.queuesize) cmd += ` queue-size="${nflog.queuesize}"`;
        if(nflog.limit) cmd += ` limit value="${nflog.limit.value}"`;
    }
    if(audit) {
        cmd += ` audit`;
        if(audit.limit) cmd += ` limit value="${audit.limit.value}"`;
    }
    if(accept) {
        cmd += ` accept`;
        if(accept.limit) cmd += ` limit value="${accept.limit.value}"`;
        cmd += `'`;
    }
    if(reject) {
        cmd += ` reject`;
        if(reject.type) cmd += ` type="${reject.type}"`;
        if(reject.limit) cmd += ` limit value="${reject.limit.value}"`;
        cmd += `'`;
    }
    if(drop) {
        cmd += ` drop`;
        if(drop.limit) cmd += ` limit value="${drop.limit.value}"`;
        cmd += `'`;
    }
    if(mark) {
        cmd += ' mark';
        if(mark.set) cmd += ` set="${mark.set}"`;
        if(mark.limit) cmd += ` limit value="${mark.limit.value}"`;
        cmd += `'`;
    }
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.removeRichRule = (req, res) => {
    const { zone, rule } = req.body;
    const { family, source, destination, service, port, protocol, icmpblock, icmptype, masquerade, forwardport, log, nflog, audit, accept, reject, drop, mark } = rule;
    let cmd = `sudo firewall-cmd --permanent --zone=${zone} --remove-rich-rule='rule`;
    if(family) cmd += ` family="${family}"`;
    if(source) {
        cmd += ` source address="${source.address}"`
        if(source.invert) cmd += ` invert="True"`;
    }
    if(destination) {
        cmd += ` destination address="${destination.address}"`
        if(destination.invert) cmd += ` invert="True"`;
    }
    if(service) cmd += ` service name="${service.name}"`;
    if(port) cmd += ` port port="${port.port}" protocol="${port.protocol}"`;
    if(protocol) cmd += ` protocol value="${protocol.value}"`;
    if(icmpblock) cmd += ` icmp-block name="${icmpblock.name}"`;
    if(icmptype) cmd += ` icmp-type name="${icmptype.name}"`;
    if(masquerade) cmd += ` masquerade`;
    if(forwardport) {
        cmd += ` forward-port port="${forwardport.port}" protocol="${forwardport.protocol}"`;
        if(forwardport.toport) cmd += ` to-port="${forwardport.toport}"`;
        if(forwardport.toaddr) cmd += ` to-addr="${forwardport.toaddr}"`;
    }
    if(log) {
        cmd += ` log`;
        if(log.prefix) cmd += ` prefix="${log.prefix}"`;
        if(log.level) cmd += ` level="${log.level}"`;
        if(log.limit) cmd += ` limit value="${log.limit.value}"`;
    }
    if(nflog) {
        cmd += ` nflog`;
        if(nflog.group) cmd += ` group="${nflog.group}"`;
        if(nflog.prefix) cmd += ` prefix="${nflog.prefix}"`;
        if(nflog.queuesize) cmd += ` queue-size="${nflog.queuesize}"`;
        if(nflog.limit) cmd += ` limit value="${nflog.limit.value}"`;
    }
    if(audit) {
        cmd += ` audit`;
        if(audit.limit) cmd += ` limit value="${audit.limit.value}"`;
    }
    if(accept) {
        cmd += ` accept`;
        if(accept.limit) cmd += ` limit value="${accept.limit.value}"`;
        cmd += `'`;
    }
    if(reject) {
        cmd += ` reject`;
        if(reject.type) cmd += ` type="${reject.type}"`;
        if(reject.limit) cmd += ` limit value="${reject.limit.value}"`;
        cmd += `'`;
    }
    if(drop) {
        cmd += ` drop`;
        if(drop.limit) cmd += ` limit value="${drop.limit.value}"`;
        cmd += `'`;
    }
    if(mark) {
        cmd += ' mark';
        if(mark.set) cmd += ` set="${mark.set}"`;
        if(mark.limit) cmd += ` limit value="${mark.limit.value}"`;
        cmd += `'`;
    }
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

// create new zone

module.exports.newZone = (req, res) => {
    const { zone } = req.body;
    const cmd = `sudo firewall-cmd --permanent --new-zone=${zone}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.newZoneFromFile = (req, res) => {
    const {zone, filename } = req.body;
    var cmd = `sudo firewall-cmd --permanent --new-zone-from-file=${filename}`;
    if(zone) cmd += ` --name=${zone}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

// delete zone

module.exports.deleteZone = (req, res) => {
    const { zone } = req.body;
    const cmd = `sudo firewall-cmd --permanent --delete-zone=${zone}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}