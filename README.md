# React and Flask (Python and iText7) based AIS Client

This a client based on JavaScript, React for using the [Swisscom All-in Signing Service (AIS)](https://www.swisscom.ch/en/business/enterprise/offer/security/all-in-signing-service.html)
to sign and/or timestamp PDF documents. The client has the same functionalities for PDF files processing as our [iText](https://itextpdf.com/en) client.

## Demo Video

[![Watcht the video](https://i.imgur.com/BSmIo45.png)](https://youtu.be/8M9KF7xGOs4)

or see it on SharePoint:

- https://swisscom-my.sharepoint.com/:v:/r/personal/paul_muntean_swisscom_com/Documents/Aufnahmen/Keycloak%20POC%20Implementation%20Session-20210728_085100-Besprechungsaufzeichnung.mp4?csf=1&web=1&e=JhHzGO

## Getting started

To start using the Swisscom AIS service and this client library, do the following:

1. Acquire an [iText license](https://itextpdf.com/en/how-buy)
2. [Get authentication details to use with the AIS client](docs/get-authentication-details.md).
3. [Configure the AIS client for your use case](docs/configure-the-AIS-client.md)
4. Use the AIS client from the [command line](docs/use-the-AIS-client-via-CLI.md)

## Quick examples

The rest of this page provides some quick examples for using the AIS client. Please see the links
above for detailed instructions on how to get authentication data, download and configure
the AIS client. The following snippets assume that you are already set up.

### Command line usage

Get a help listing by calling the client without any parameters:

```shell
./bin/ais-client.sh
```

or

```shell
./bin/ais-client.sh -help
```

Get a default configuration file set in the current folder using the _-init_ parameter:

```shell
./bin/ais-client.sh -init
```

Apply an On Demand signature with Step Up on a local PDF file:

```shell
./bin/ais-client.sh -type ondemand-stepup -input local-sample-doc.pdf -output test-sign.pdf
```

You can also add the following parameters for extra help:

- _-v_: verbose log output (sets most of the client loggers to debug)
- _-vv_: even more verbose log output (sets all the client loggers to debug, plus the Apache HTTP Client to debug, showing input and output HTTP traffic)
- _-config_: select a custom properties file for configuration (by default it looks for the one named _sign-pdf.properties_)

More than one file can be signed/timestamped at once:

```shell
./bin/ais-client.sh -type ondemand-stepup -input doc1.pdf -input doc2.pdf -input doc3.pdf
```

You don't have to specify the output file:

```shell
./bin/ais-client.sh -type ondemand-stepup -input doc1.pdf
```

The output file name is composed of the input file name plus a configurable _suffix_ (by default it is "-signed-#time", where _#time_
is replaced at runtime with the current date and time). You can customize this suffix:

```shell
./bin/ais-client.sh -type ondemand-stepup -input doc1.pdf -suffix -output-#time
```

## References

- [Swisscom All-In Signing Service homepage](https://www.swisscom.ch/en/business/enterprise/offer/security/all-in-signing-service.html)
- [Swisscom All-In Signing Service reference documentation (PDF)](http://documents.swisscom.com/product/1000255-Digital_Signing_Service/Documents/Reference_Guide/Reference_Guide-All-in-Signing-Service-en.pdf)
- [Swisscom Trust Services documentation](https://trustservices.swisscom.com/en/downloads/)
- [iText library](https://itextpdf.com/en)
