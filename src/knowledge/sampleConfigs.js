// Sample configuration files for demo mode

export const sampleConfigs = {
  cisco: {
    name: 'EDGE-FW-01',
    vendor: 'Cisco IOS',
    filename: 'edge-fw-01.cfg',
    content: `!
! Cisco IOS Configuration - EDGE-FW-01
! Last configuration change at 14:32:05 UTC Mon Sep 30 2026
!
version 15.9
service timestamps debug datetime msec
service timestamps log datetime msec
service password-encryption
!
hostname EDGE-FW-01
!
boot-start-marker
boot-end-marker
!
enable secret 9 $9$Fk7SXjYmjNBwz.$DK4vH5xRmkL2wFPqY/
!
aaa new-model
aaa authentication login default local
aaa authorization exec default local
!
ip ssh version 2
ip ssh time-out 60
ip ssh authentication-retries 3
!
no service telnet
no ip http server
ip http secure-server
!
security passwords min-length 14
login block-for 120 attempts 3 within 60
login on-failure log
login on-success log
!
archive
 log config
  logging enable
  notify syslog
!
logging host 10.1.100.50
logging trap informational
!
ntp server 10.1.100.10
ntp authenticate
ntp authentication-key 1 md5 NTPsecure2024
ntp trusted-key 1
!
banner login ^
==============================================
  AUTHORIZED ACCESS ONLY
  All activity is monitored and recorded.
  Unauthorized access is prohibited.
==============================================
^
!
access-list 10 permit 10.1.0.0 0.0.255.255
access-list 10 deny any log
!
line con 0
 exec-timeout 15 0
 logging synchronous
line vty 0 4
 exec-timeout 15 0
 access-class 10 in
 transport input ssh
!
no cdp run
no service pad
no service finger
no ip bootp server
no ip source-route
!
ip ssh server algorithm encryption aes256-ctr aes128-ctr
!
end`
  },
  fortinet: {
    name: 'CORE-FW-02',
    vendor: 'FortiOS',
    filename: 'core-fw-02.conf',
    content: `config system global
    set hostname "CORE-FW-02"
    set timezone "UTC"
    set admin-ssh-port 22
    set admin-ssh-v1 disable
    set admin-telnet disable
    set admin-http disable
    set admin-https enable
    set admintimeout 10
    set admin-lockout-threshold 3
    set admin-lockout-duration 120
    set strong-crypto enable
    set pre-login-banner enable
end

config system admin
    edit "admin"
        set password ENC SH2+encrypted+hash
        set accprofile "super_admin"
    next
end

config system password-policy
    set status enable
    set min-length 14
    set min-upper-case-letter 1
    set min-lower-case-letter 1
    set min-number 1
    set min-non-alphanumeric 1
    set expire-status enable
    set expire-day 90
end

config log syslogd setting
    set status enable
    set server "10.2.100.50"
    set port 514
    set facility local7
end

config log setting
    set log-admin-activity enable
    set log-auth-event enable
end

config system ntp
    set ntpsync enable
    set server-mode enable
    config ntpserver
        edit 1
            set server "10.2.100.10"
        next
    end
end

config system interface
    edit "mgmt"
        set ip 10.2.0.1 255.255.255.0
        set allowaccess ping https ssh
    next
end

config firewall policy
    edit 1
        set name "Allow-Internal"
        set srcintf "internal"
        set dstintf "wan1"
        set srcaddr "all"
        set dstaddr "all"
        set action accept
        set schedule "always"
        set service "ALL"
        set logtraffic all
    next
    edit 2
        set name "Deny-All"
        set srcintf "any"
        set dstintf "any"
        set srcaddr "all"
        set dstaddr "all"
        set action deny
        set schedule "always"
        set service "ALL"
        set logtraffic all
    next
end

config user local
    edit "localadmin"
        set type password
        set passwd ENC AK1encrypted
    next
end`
  },
  junos: {
    name: 'DIST-SW-03',
    vendor: 'JunOS',
    filename: 'dist-sw-03.conf',
    content: `set system host-name DIST-SW-03
set system domain-name corp.internal
set system time-zone UTC

set system services ssh
set system services ssh protocol-version v2
set system services ssh root-login deny
delete system services telnet
set system services web-management https

set system login idle-timeout 10
set system login message "\\n=== AUTHORIZED ACCESS ONLY ===\\n"

set system login password minimum-length 12

set system syslog host 10.3.100.50 any info
set system syslog host 10.3.100.50 authorization info
set system syslog file messages any notice
set system syslog file interactive-commands interactive-commands any

set system ntp server 10.3.100.10

set firewall filter MGMT-ACCESS term ALLOW-SSH from protocol tcp
set firewall filter MGMT-ACCESS term ALLOW-SSH from destination-port 22
set firewall filter MGMT-ACCESS term ALLOW-SSH then accept
set firewall filter MGMT-ACCESS term DENY-ALL then reject

set interfaces lo0 unit 0 family inet filter input MGMT-ACCESS

set system login class admin-class permissions all
set system login user netadmin class admin-class
set system login user netadmin authentication encrypted-password "$6$rounds=100000$SALT$HASH"

set protocols lldp interface all disable`
  },
  unknown: {
    name: 'BRANCH-GW-04',
    vendor: 'Unknown',
    filename: 'branch-gw-04.txt',
    description: 'Unknown Appliance A (Training Baseline)',
    content: `# Branch Gateway Configuration
# Device: BRANCH-GW-04
# Firmware: SecureOS v3.2.1

system hostname BRANCH-GW-04
system domain internal.corp

security admin-access ssh enable
security admin-access ssh version 2
security admin-access telnet disable
security admin-access web-ui https-only

set secure-admin session-limit 900
set secure-admin lockout-attempts 5
set secure-admin lockout-duration 300

authentication method local-database
authentication password-policy min-chars 10
authentication password-policy complexity enabled
authentication enable-secret hash $argon2id$HASH

monitor syslog-server 10.4.100.50
monitor syslog-level informational
monitor admin-audit enabled
monitor auth-events enabled

time-sync ntp-server 10.4.100.10
time-sync ntp-auth enabled

network firewall rule 1 permit source 10.4.0.0/16 dest any proto tcp port 22
network firewall rule 2 permit source 10.4.0.0/16 dest any proto tcp port 443
network firewall rule 999 deny source any dest any
network firewall default-action deny

services disable telnet
services disable ftp
services disable tftp
services disable snmp-default
services discovery-protocol disable external

banner-message "AUTHORIZED PERSONNEL ONLY - Activity Monitored"

crypto preferred-cipher aes-256-gcm
crypto key-exchange ecdh-sha2-nistp384`
  },
  unknownB: {
    name: 'CAMPUS-GW-05',
    vendor: 'Unknown',
    filename: 'campus-gw-05.txt',
    description: 'Unseen Device B (Testing Generalization - Never used during training)',
    content: `# Campus Gateway Configuration
# Device: CAMPUS-GW-05
# Firmware: SecureOS v3.2.1
# NOTE: This configuration was NEVER used during training.

system hostname CAMPUS-GW-05
system domain internal.campus.corp

security admin-access ssh enable
security admin-access ssh version 2
security admin-access telnet disable
security admin-access web-ui https-only

set secure-admin session-limit 600
set secure-admin lockout-attempts 3
set secure-admin lockout-duration 180

authentication method local-database
authentication password-policy min-chars 14
authentication password-policy complexity enabled
authentication enable-secret hash $argon2id$HASH_CAMPUS

monitor syslog-server 10.5.100.50
monitor syslog-level informational
monitor admin-audit enabled
monitor auth-events enabled

time-sync ntp-server 10.5.100.10
time-sync ntp-auth enabled

network firewall rule 1 permit source 10.5.0.0/16 dest any proto tcp port 22
network firewall rule 2 permit source 10.5.0.0/16 dest any proto tcp port 443
network firewall rule 999 deny source any dest any
network firewall default-action deny

services disable telnet
services disable ftp
services disable tftp
services disable snmp-default
services discovery-protocol disable external

banner-message "CAMPUS GATEWAY - AUTHORIZED ACCESS ONLY"

crypto preferred-cipher aes-256-gcm
crypto key-exchange ecdh-sha2-nistp384`
  }
};
