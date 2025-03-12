const { runCommand } = require('./runCommand');
const { reloadFirewall } = require('./firewall_controller');

// Policy information

module.exports.getPolicies = (req, res) => {
    runCommand('sudo firewall-cmd --get-policies', res);
}

module.exports.getPoliciesInfo = (req, res) => {
    runCommand('sudo firewall-cmd --list-all-policies', res);
}

module.exports.getPolicyInfo = (req, res) => {
    const { policy } = req.body;
    const cmd = `sudo firewall-cmd --info-policy=${policy}`;
    runCommand(cmd, res);
}

module.exports.loadDefaultSettingsPolicy = (req, res) => {
    const { policy } = req.body;
    const cmd = `sudo firewall-cmd --permanent --load-policy-defaults=${policy}`;
    runCommand(cmd, res);
}

module.exports.getPathPolicy = (req, res) => {
    const { policy } = req.body;
    const cmd = `sudo firewall-cmd --permanent --path-policy=${policy}`;
    runCommand(cmd, res);
}

// target

module.exports.getTarget = (req, res) => {
    const { policy } = req.body;
    const cmd = `sudo firewall-cmd --permanent --policy=${policy} --get-target`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.setTarget = (req, res) => {
    const { policy, target } = req.body;
    const cmd = `sudo firewall-cmd --permanent --policy=${policy} --set-target=${target}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

// description

module.exports.getDescription = (req, res) => {
    const { policy } = req.body;
    const cmd = `sudo firewall-cmd --permanent --policy=${policy} --get-description`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.setDescription = (req, res) => {
    const { policy, description } = req.body;
    const cmd = `sudo firewall-cmd --permanent --policy=${policy} --set-description=${description}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

// short

module.exports.getShort = (req, res) => {
    const { policy } = req.body;
    const cmd = `sudo firewall-cmd --permanent --policy=${policy} --get-short`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.setShort = (req, res) => {
    const { policy, short } = req.body;
    const cmd = `sudo firewall-cmd --permanent --policy=${policy} --set-short=${short}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

// priority

module.exports.getPriority = (req, res) => {
    const { policy } = req.body;
    const cmd = `sudo firewall-cmd --permanent --policy=${policy} --get-priority`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.setPriority = (req, res) => {
    const { policy, priority } = req.body;
    const cmd = `sudo firewall-cmd --permanent --policy=${policy} --set-priority=${priority}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

// ingress policies

module.exports.listIngressPolicies = (req, res) => {
    const { policy } = req.body;
    const cmd = `sudo firewall-cmd --permanent --policy=${policy} --list-ingress-zones`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.queryIngressPolicy = (req, res) => {
    const { policy, zone } = req.body;
    const cmd = `sudo firewall-cmd --permanent --policy=${policy} --query-ingress-zone=${zone}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.addIngressPolicy = (req, res) => {
    const { policy, zone } = req.body;
    const cmd = `sudo firewall-cmd --permanent --policy=${policy} --add-ingress-zone=${zone}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.removeIngressPolicy = (req, res) => {
    const { policy, zone } = req.body;
    const cmd = `sudo firewall-cmd --permanent --policy=${policy} --remove-ingress-zone=${zone}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

// egress policys

module.exports.listEgressPolicies = (req, res) => {
    const { policy } = req.body;
    const cmd = `sudo firewall-cmd --permanent --policy=${policy} --list-egress-zones`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.queryEgressPolicy = (req, res) => {
    const { policy, zone } = req.body;
    const cmd = `sudo firewall-cmd --permanent --policy=${policy} --query-egress-zone=${zone}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.addEgressPolicy = (req, res) => {
    const { policy, zone } = req.body;
    const cmd = `sudo firewall-cmd --permanent --policy=${policy} --add-egress-zone=${zone}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.removeEgressPolicy = (req, res) => {
    const { policy, zone } = req.body;
    const cmd = `sudo firewall-cmd --permanent --policy=${policy} --remove-egress-zone=${zone}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

// services

module.exports.listServices = (req, res) => {
    const { policy } = req.body;
    const cmd = `sudo firewall-cmd --permanent --policy=${policy} --list-services`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.queryService = (req, res) => {
    const { policy, service } = req.body;
    const cmd = `sudo firewall-cmd --permanent --policy=${policy} --query-service=${service}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.addService = (req, res) => {
    const { policy, service } = req.body;
    const cmd = `sudo firewall-cmd --permanent --policy=${policy} --add-service=${service}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.removeService = (req, res) => {
    const { policy, service } = req.body;
    const cmd = `sudo firewall-cmd --permanent --policy=${policy} --remove-service=${service}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

// ports

module.exports.listPorts = (req, res) => {
    const { policy } = req.body;
    const cmd = `sudo firewall-cmd --permanent --policy=${policy} --list-ports`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.queryPort = (req, res) => {
    const { policy, port, protocol } = req.body;
    const cmd = `sudo firewall-cmd --permanent --policy=${policy} --query-port=${port}/${protocol}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.addPort = (req, res) => {
    const { policy, port, protocol } = req.body;
    const cmd = `sudo fireall-cmd --permanent --policy=${policy} --add-port=${port}/${protocol}`;
    runCommand(cmd, run);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.removePort = (req, res) => {
    const { policy, port, protocol } = req.body;
    const cmd = `sudo firewall-cmd --permanent --policy=${policy} --remove-port=${port}/${protocol}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

// protocols

module.exports.listProtocols = (req, res) => {
    const { policy } = req.body;
    const cmd = `sudo firewall-cmd --permanent --policy=${policy} --list-protocols`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.queryProtocol = (req, res) => {
    const { policy, protocol } = req.body;
    const cmd = `sudo firewall-cmd --permanent --policy=${policy} --query-protocol=${protocol}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.addProtocol = (req, res) => {
    const { policy, protocol } = req.body;
    const cmd = `sudo firewall-cmd --permanent --policy=${policy} --add-protocol=${protocol}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.removeProtocol = (req, res) => {
    const { policy, protocol } = req.body;
    const cmd = `sudo firewall-cmd --permanent --policy=${policy} --remove-protocol=${protocol}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

// source ports

module.exports.listSourcePorts = (req, res) => {
    const { policy } = req.body;
    const cmd = `sudo firewall-cmd --permanent --policy=${policy} --list-source-ports`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.querySourcePort = (req, res) => {
    const { policy, port, protocol } = req.body;
    const cmd = `sudo firewall-cmd --permanent --policy=${policy} --query-source-port=${port}/${protocol}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.addSourcePort = (req, res) => {
    const { policy, port, protocol } = req.body;
    const cmd = `sudo firewall-cmd --permanent --policy=${policy} --add-source-port=${port}/${protocol}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.removeSourcePort = (req, res) => {
    const { policy, port, protocol } = req.body;
    const cmd = `sudo firewall-cmd --permanent --policy=${policy} --remove-source-port=${port}/${protocol}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

// icmptypes

module.exports.listICMPBlocks = (req, res) => {
    const { policy } = req.body;
    const cmd = `sudo firewall-cmd --permanent --policy=${policy} --list-icmp-blocks`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.queryICMPBlock = (req, res) => {
    const { policy, icmptype } = req.body;
    const cmd = `sudo firewall-cmd --permanent --policy=${policy} --query-icmp-block=${icmptype}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.addICMPBlock = (req, res) => {
    const { policy, icmptype } = req.body;
    const cmd = `sudo firewall-cmd --permanent --policy=${policy} --add-icmp-block=${icmptype}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.removeICMPBlock = (req, res) => {
    const { policy, icmptype } = req.body;
    const cmd = `sudo firewall-cmd --permanent --policy=${policy} --remove-icmp-block=${icmptype}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

// forward ports

module.exports.listForwardPorts = (req, res) => {
    const { policy } = req.body;
    const cmd = `sudo firewall-cmd --permanent --policy=${policy} --list-forward-ports`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.queryForwardPort = (req, res) => {
    const { policy, port, protocol, toPort, toAddress } = req.body;
    if(toPort && toAddress) {
        const cmd = `sudo firewall-cmd --permanent --policy=${policy} --query-forward-port=port=${port}:proto=${protocol}:toport=${toPort}:toaddr=${toAddress}`;
        runCommand(cmd, res);
    }
    else if(toPort && !toAddress) {
        const cmd = `sudo firewall-cmd --permanent --policy=${policy} --query-forward-port=port=${port}:proto=${protocol}:toport=${toPort}`;
        runCommand(cmd, res);
    }
    else if(!toPort && toAddress) {
        const cmd = `sudo firewall-cmd --permanent --policy=${policy} --query-forward-port=port=${port}:proto=${protocol}:toaddr=${toAddress}`;
        runCommand(cmd, res);
    }
    else {
        const cmd = `sudo firewall-cmd --permanent --policy-${policy} --query-forward-port=port=${port}:proto=${protocol}`;
        runCommand(cmd, res);
    }
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.addForwardPort = (req, res) => {
    const { policy, port, protocol, toPort, toAddress } = req.body;
    if(toPort && toAddress) {
        const cmd = `sudo firewall-cmd --permanent --policy=${policy} --add-forward-port=port=${port}:proto=${protocol}:toport=${toPort}:toaddr=${toAddress}`;
        runCommand(cmd, res);
    }
    else if(toPort && !toAddress) {
        const cmd = `sudo firewall-cmd --permanent --policy=${policy} --add-forward-port=port=${port}:proto=${protocol}:toport=${toPort}`;
        runCommand(cmd, res);
    }
    else if(!toPort && toAddress) {
        const cmd = `sudo firewall-cmd --permanent --policy=${policy} --add-forward-port=port=${port}:proto=${protocol}:toaddr=${toAddress}`;
        runCommand(cmd, res);
    }
    else {
        const cmd = `sudo firewall-cmd --permanent --policy-${policy} --add-forward-port=port=${port}:proto=${protocol}`;
        runCommand(cmd, res);
    }
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.removeForwardPort = (req, res) => {
    const { policy, port, protocol, toPort, toAddress } = req.body;
    if(toPort && toAddress) {
        const cmd = `sudo firewall-cmd --permanent --policy=${policy} --remove-forward-port=port=${port}:proto=${protocol}:toport=${toPort}:toaddr=${toAddress}`;
        runCommand(cmd, res);
    }
    else if(toPort && !toAddress) {
        const cmd = `sudo firewall-cmd --permanent --policy=${policy} --remove-forward-port=port=${port}:proto=${protocol}:toport=${toPort}`;
        runCommand(cmd, res);
    }
    else if(!toPort && toAddress) {
        const cmd = `sudo firewall-cmd --permanent --policy=${policy} --remove-forward-port=port=${port}:proto=${protocol}:toaddr=${toAddress}`;
        runCommand(cmd, res);
    }
    else {
        const cmd = `sudo firewall-cmd --permanent --policy-${policy} --remove-forward-port=port=${port}:proto=${protocol}`;
        runCommand(cmd, res);
    }
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

// masquerade(NAT)

module.exports.queryMasquerade = (req, res) => {
    const { policy } = req.body;
    const cmd = `sudo firewall-cmd --permanent --policy=${policy} --query-masquerade`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.addMasquerade = (req, res) => {
    const { policy } = req.body;
    const cmd = `sudo firewall-cmd --permanent --policy=${policy} --add-masquerade`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.removeMasquerade = (req, res) => {
    const { policy } = req.body;
    const cmd = `sudo firewall-cmd --permanent --policy=${policy} --remove-masquerade`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

// rich rules

module.exports.listRichRules = (req, res) => {
    const { policy } = req.body;
    const cmd = `sudo firewall-cmd --permanent --policy=${policy} --list-rich-rules`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.queryRichRule = (req, res) => {
    const { policy, rule } = req.body;
    const { family, source, destination, service, port, protocol, icmpblock, icmptype, masquerade, forwardport, log, nflog, audit, accept, reject, drop, mark } = rule;
    let cmd = `sudo firewall-cmd --permanent --policy=${policy} --query-rich-rule='rule`;
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
    const { policy, rule } = req.body;
    const { family, source, destination, service, port, protocol, icmpblock, icmptype, masquerade, forwardport, log, nflog, audit, accept, reject, drop, mark } = rule;
    let cmd = `sudo firewall-cmd --permanent --policy=${policy} --add-rich-rule='rule`;
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
    const { policy, rule } = req.body;
    const { family, source, destination, service, port, protocol, icmpblock, icmptype, masquerade, forwardport, log, nflog, audit, accept, reject, drop, mark } = rule;
    let cmd = `sudo firewall-cmd --permanent --policy=${policy} --remove-rich-rule='rule`;
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

// create new policy

module.exports.newPolicy = (req, res) => {
    const { policy } = req.body;
    const cmd = `sudo firewall-cmd --permanent --new-policy=${policy}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.newPolicyFromFile = (req, res) => {
    const {policy, filename } = req.body;
    var cmd = `sudo firewall-cmd --permanent --new-policy-from-file=${filename}`;
    if(policy) cmd += ` --name=${policy}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

// delete policy

module.exports.deletePolicy = (req, res) => {
    const { policy } = req.body;
    const cmd = `sudo firewall-cmd --permanent --delete-policy=${policy}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}