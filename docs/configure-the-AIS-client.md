# Configure the AIS client
To use the AIS client, you first have to [obtain it (or build it)](build-or-download.md), then you have to configure it. The way you configure
the client depends a lot on how you plan to use the client and integrate it in your project/setup.

## Properties files
The AIS client can be configured from a properties file. Dedicate placeholder ```${...}``` can be used for the iText license file path and for 
the private key secret in order to load the value from the environment variables. Here is an example of such a file:

```properties
# The iText license file path. Also, env placeholder is supported (e.g. ${AIS-PRIVATE-KEY-SECRET})
license.file=${ITEXT_LICENSE_FILE_PATH}
# The AIS server REST URL for sending the Signature requests
server.rest.signUrl=https://ais.swisscom.com/AIS-Server/rs/v1.0/sign
# The AIS server REST URL for sending the Signature status poll requests (Pending requests)
server.rest.pendingUrl=https://ais.swisscom.com/AIS-Server/rs/v1.0/pending
# The AIS server trusted CA certificate file. The configuration parameter is optional and in case it is omitted the CA must be a trusted one.
server.cert.file=/home/user/ais-server.crt
# --
# The client's private key file (corresponding to the public key attached to the client's certificate)
client.auth.keyFile=/home/user/ais-client.key
# The password of the client's private key. This can be left blank if the private key is not protected with a password.
# Also, env placeholder is supported (e.g. ${AIS-PRIVATE-KEY-SECRET}).
client.auth.keyPassword=secret
# The client's certificate file
client.cert.file=/home/user/ais-client.crt
# The maximum number of connections that the HTTP client used by the AIS client can create and reuse simultaneously
client.http.maxTotalConnections=20
# The maximum number of connections PER ROUTE that the HTTP client used by the AIS client can use
client.http.maxConnectionsPerRoute=10
# The HTTP connection timeout in SECONDS (the maximum time allowed for the HTTP client to wait for the TCP socket connection
# to be established until the request is dropped and the client gives up).
client.http.connectionTimeoutInSeconds=10
# The HTTP response timeout in SECONDS (the maximum time allowed for the HTTP client to wait for the response to be received
# for any one request until the request is dropped and the client gives up).
client.http.responseTimeoutInSeconds=20
# The interval IN SECONDS for the client to poll for signature status (for each parallel request).
client.poll.intervalInSeconds=10
# The total number of rounds (including the first Pending request) that the client runs for each parallel request. After this
# number of rounds of calling the Pending endpoint for an ongoing request, the client gives up and signals a timeout for that
# respective request.
client.poll.rounds=10
# --
# The standard to use for creating the signature.
# Choose from: DEFAULT, CAdES, PDF, PAdES, PAdES-Baseline, PLAIN.
# Leave it empty and the client will use sensible defaults.
signature.standard=PAdES-Baseline
# The type and method of revocation information to receive from the server.
# Choose from: DEFAULT, CAdES, PDF, PAdES, PAdES-Baseline, BOTH, PLAIN.
# Leave it empty and the client will use sensible defaults.
signature.revocationInformation=PAdES
# Whether to add a timestamp to the signature or not. Default is true.
# Leave it empty and the client will use sensible defaults.
signature.addTimestamp=true
# --
# The AIS Claimed Identity name. The right Claimed Identity (and key, see below) must be used for the right signature type.
signature.claimedIdentityName=ais-90days-trial
# The AIS Claimed Identity key. The key together with the name (see above) is used for starting the correct signature type.
signature.claimedIdentityKey=keyEntity
# The client's Subject DN to which the certificate is bound.
signature.distinguishedName=cn=TEST User, givenname=Max, surname=Maximus, c=US, serialnumber=abcdefabcdefabcdefabcdefabcdef
# --
# The language (one of "en", "fr", "de", "it") to be used during the Step Up interaction with the mobile user.
signature.stepUp.language=en
# The MSISDN (in international format) of the mobile user to interact with during the Step Up phase.
signature.stepUp.msisdn=40799999999
# The message to present to the mobile user during the Step Up phase.
signature.stepUp.message=Please confirm the signing of the document
# The mobile user's Serial Number to validate during the Step Up phase. If this number is different than the one registered on the server
# side for the mobile user, the request will fail.
signature.stepUp.serialNumber=
# --
# The name to embed in the signature to be created.
signature.name=TEST Signer
# The reason for this signature to be created.
signature.reason=Testing signature
# The location where the signature is created.
signature.location=Testing location
# The contact info to embed in the signature to be created.
signature.contactInfo=tester.test@test.com
```

Once you create this file and configure its properties accordingly, it can either be picked up by the AIS client when you use it via its 
CLI interface, or you can use it to populate the objects that configure the client.

*CLI usage:*
```shell
./bin/ais-client.sh -type ondemand-stepup -config config.properties -input local-sample-doc.pdf -output test-sign.pdf
```
