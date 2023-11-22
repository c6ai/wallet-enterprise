import { injectable } from "inversify";
import 'reflect-metadata';
import config from "../../config";
import { CTWalletSameInTimeSupportedCredential } from "./SupportedCredentialsConfiguration/CTWalletIntimeSupportedCredential";
import { CTWalletSameDeferredSupportedCredential } from "./SupportedCredentialsConfiguration/CTWalletSameDeferredSupportedCredential";
import { CTWalletSamePreAuthorisedSupportedCredential } from "./SupportedCredentialsConfiguration/CTWalletSamePreAuthorised";
import { CredentialIssuersRepository } from "../lib/CredentialIssuersRepository";
import { CredentialIssuer } from "../lib/CredentialIssuerConfig/CredentialIssuer";
import { VIDSupportedCredential } from "./SupportedCredentialsConfiguration/VIDSupportedCredential";
import { CredentialIssuersConfiguration } from "../services/interfaces";


@injectable()
export class CredentialIssuersConfigurationService implements CredentialIssuersConfiguration {
	readonly credentialIssuerIdentifierVID = config.url;


	public registeredCredentialIssuerRepository(): CredentialIssuersRepository {
		const vidIssuer = new CredentialIssuer()
			.setCredentialIssuerIdentifier(this.credentialIssuerIdentifierVID)
			.setWalletId("conformant")
			.setAuthorizationServerURL(config.url)
			.setCredentialEndpoint(this.credentialIssuerIdentifierVID + "/openid4vci/credential")
			// .setDeferredCredentialEndpoint(config.url + "/openid4vci/deferred")

		vidIssuer.addSupportedCredential(new CTWalletSameInTimeSupportedCredential(vidIssuer));
		vidIssuer.addSupportedCredential(new CTWalletSameDeferredSupportedCredential(vidIssuer));
		vidIssuer.addSupportedCredential(new CTWalletSamePreAuthorisedSupportedCredential(vidIssuer));
		vidIssuer.addSupportedCredential(new VIDSupportedCredential(vidIssuer));

		const vidIssuer2 = new CredentialIssuer()
			.setCredentialIssuerIdentifier(config.url + "/vid")
			.setWalletId("conformant")
			.setAuthorizationServerURL(config.url)
			.setCredentialEndpoint(config.url + "/vid/openid4vci/credential")
			// .setDeferredCredentialEndpoint(config.url + "/vid/openid4vci/deferred");
		vidIssuer2.addSupportedCredential(new CTWalletSameInTimeSupportedCredential(vidIssuer2));
		vidIssuer2.addSupportedCredential(new CTWalletSameDeferredSupportedCredential(vidIssuer2));
		vidIssuer2.addSupportedCredential(new CTWalletSamePreAuthorisedSupportedCredential(vidIssuer2));
	
		return new CredentialIssuersRepository([
			vidIssuer,
			vidIssuer2
		]);
	}

	public registeredClients(): { client_id: string; friendlyName: string; redirectUri: string; }[] {
		return [ ]
	}

	public defaultCredentialIssuerIdentifier(): string {
		return this.credentialIssuerIdentifierVID;
	}
}