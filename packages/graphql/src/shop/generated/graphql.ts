/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> =
  | T
  | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type AdjustmentType = 'DISTRIBUTED_ORDER_PROMOTION' | 'OTHER' | 'PROMOTION';

export type AssetType = 'BINARY' | 'IMAGE' | 'VIDEO';

/** Operators for filtering on a Boolean field */
export type BooleanOperators = {
  eq?: boolean | null | undefined;
  isNull?: boolean | null | undefined;
};

export type CollectionFilterParameter = {
  _and?: Array<CollectionFilterParameter> | null | undefined;
  _or?: Array<CollectionFilterParameter> | null | undefined;
  createdAt?: DateOperators | null | undefined;
  description?: StringOperators | null | undefined;
  id?: IdOperators | null | undefined;
  languageCode?: StringOperators | null | undefined;
  name?: StringOperators | null | undefined;
  parentId?: IdOperators | null | undefined;
  position?: NumberOperators | null | undefined;
  productVariantCount?: NumberOperators | null | undefined;
  slug?: StringOperators | null | undefined;
  updatedAt?: DateOperators | null | undefined;
};

export type CollectionListOptions = {
  /** Allows the results to be filtered */
  filter?: CollectionFilterParameter | null | undefined;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: LogicalOperator | null | undefined;
  /** Skips the first n results, for use in pagination */
  skip?: number | null | undefined;
  /** Specifies which properties to sort the results by */
  sort?: CollectionSortParameter | null | undefined;
  /** Takes n results, for use in pagination */
  take?: number | null | undefined;
  topLevelOnly?: boolean | null | undefined;
};

export type CollectionSortParameter = {
  createdAt?: SortOrder | null | undefined;
  description?: SortOrder | null | undefined;
  id?: SortOrder | null | undefined;
  name?: SortOrder | null | undefined;
  parentId?: SortOrder | null | undefined;
  position?: SortOrder | null | undefined;
  productVariantCount?: SortOrder | null | undefined;
  slug?: SortOrder | null | undefined;
  updatedAt?: SortOrder | null | undefined;
};

/**
 * Input used to create an Address.
 *
 * The countryCode must correspond to a `code` property of a Country that has been defined in the
 * Vendure server. The `code` property is typically a 2-character ISO code such as "GB", "US", "DE" etc.
 * If an invalid code is passed, the mutation will fail.
 */
export type CreateAddressInput = {
  city?: string | null | undefined;
  company?: string | null | undefined;
  countryCode: string;
  customFields?: unknown;
  defaultBillingAddress?: boolean | null | undefined;
  defaultShippingAddress?: boolean | null | undefined;
  fullName?: string | null | undefined;
  phoneNumber?: string | null | undefined;
  postalCode?: string | null | undefined;
  province?: string | null | undefined;
  streetLine1: string;
  streetLine2?: string | null | undefined;
};

export type CreateCustomerCustomFieldsInput = {
  marketingOptIn?: boolean | null | undefined;
  marketingOptInAt?: string | null | undefined;
  preferredActivity?: string | null | undefined;
};

export type CreateCustomerInput = {
  customFields?: CreateCustomerCustomFieldsInput | null | undefined;
  emailAddress: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string | null | undefined;
  title?: string | null | undefined;
};

/**
 * @description
 * ISO 4217 currency code
 *
 * @docsCategory common
 */
export type CurrencyCode =
  /** United Arab Emirates dirham */
  | 'AED'
  /** Afghan afghani */
  | 'AFN'
  /** Albanian lek */
  | 'ALL'
  /** Armenian dram */
  | 'AMD'
  /** Netherlands Antillean guilder */
  | 'ANG'
  /** Angolan kwanza */
  | 'AOA'
  /** Argentine peso */
  | 'ARS'
  /** Australian dollar */
  | 'AUD'
  /** Aruban florin */
  | 'AWG'
  /** Azerbaijani manat */
  | 'AZN'
  /** Bosnia and Herzegovina convertible mark */
  | 'BAM'
  /** Barbados dollar */
  | 'BBD'
  /** Bangladeshi taka */
  | 'BDT'
  /** Bulgarian lev */
  | 'BGN'
  /** Bahraini dinar */
  | 'BHD'
  /** Burundian franc */
  | 'BIF'
  /** Bermudian dollar */
  | 'BMD'
  /** Brunei dollar */
  | 'BND'
  /** Boliviano */
  | 'BOB'
  /** Brazilian real */
  | 'BRL'
  /** Bahamian dollar */
  | 'BSD'
  /** Bhutanese ngultrum */
  | 'BTN'
  /** Botswana pula */
  | 'BWP'
  /** Belarusian ruble */
  | 'BYN'
  /** Belize dollar */
  | 'BZD'
  /** Canadian dollar */
  | 'CAD'
  /** Congolese franc */
  | 'CDF'
  /** Swiss franc */
  | 'CHF'
  /** Chilean peso */
  | 'CLP'
  /** Renminbi (Chinese) yuan */
  | 'CNY'
  /** Colombian peso */
  | 'COP'
  /** Costa Rican colon */
  | 'CRC'
  /** Cuban convertible peso */
  | 'CUC'
  /** Cuban peso */
  | 'CUP'
  /** Cape Verde escudo */
  | 'CVE'
  /** Czech koruna */
  | 'CZK'
  /** Djiboutian franc */
  | 'DJF'
  /** Danish krone */
  | 'DKK'
  /** Dominican peso */
  | 'DOP'
  /** Algerian dinar */
  | 'DZD'
  /** Egyptian pound */
  | 'EGP'
  /** Eritrean nakfa */
  | 'ERN'
  /** Ethiopian birr */
  | 'ETB'
  /** Euro */
  | 'EUR'
  /** Fiji dollar */
  | 'FJD'
  /** Falkland Islands pound */
  | 'FKP'
  /** Pound sterling */
  | 'GBP'
  /** Georgian lari */
  | 'GEL'
  /** Ghanaian cedi */
  | 'GHS'
  /** Gibraltar pound */
  | 'GIP'
  /** Gambian dalasi */
  | 'GMD'
  /** Guinean franc */
  | 'GNF'
  /** Guatemalan quetzal */
  | 'GTQ'
  /** Guyanese dollar */
  | 'GYD'
  /** Hong Kong dollar */
  | 'HKD'
  /** Honduran lempira */
  | 'HNL'
  /** Croatian kuna */
  | 'HRK'
  /** Haitian gourde */
  | 'HTG'
  /** Hungarian forint */
  | 'HUF'
  /** Indonesian rupiah */
  | 'IDR'
  /** Israeli new shekel */
  | 'ILS'
  /** Indian rupee */
  | 'INR'
  /** Iraqi dinar */
  | 'IQD'
  /** Iranian rial */
  | 'IRR'
  /** Icelandic króna */
  | 'ISK'
  /** Jamaican dollar */
  | 'JMD'
  /** Jordanian dinar */
  | 'JOD'
  /** Japanese yen */
  | 'JPY'
  /** Kenyan shilling */
  | 'KES'
  /** Kyrgyzstani som */
  | 'KGS'
  /** Cambodian riel */
  | 'KHR'
  /** Comoro franc */
  | 'KMF'
  /** North Korean won */
  | 'KPW'
  /** South Korean won */
  | 'KRW'
  /** Kuwaiti dinar */
  | 'KWD'
  /** Cayman Islands dollar */
  | 'KYD'
  /** Kazakhstani tenge */
  | 'KZT'
  /** Lao kip */
  | 'LAK'
  /** Lebanese pound */
  | 'LBP'
  /** Sri Lankan rupee */
  | 'LKR'
  /** Liberian dollar */
  | 'LRD'
  /** Lesotho loti */
  | 'LSL'
  /** Libyan dinar */
  | 'LYD'
  /** Moroccan dirham */
  | 'MAD'
  /** Moldovan leu */
  | 'MDL'
  /** Malagasy ariary */
  | 'MGA'
  /** Macedonian denar */
  | 'MKD'
  /** Myanmar kyat */
  | 'MMK'
  /** Mongolian tögrög */
  | 'MNT'
  /** Macanese pataca */
  | 'MOP'
  /** Mauritanian ouguiya */
  | 'MRU'
  /** Mauritian rupee */
  | 'MUR'
  /** Maldivian rufiyaa */
  | 'MVR'
  /** Malawian kwacha */
  | 'MWK'
  /** Mexican peso */
  | 'MXN'
  /** Malaysian ringgit */
  | 'MYR'
  /** Mozambican metical */
  | 'MZN'
  /** Namibian dollar */
  | 'NAD'
  /** Nigerian naira */
  | 'NGN'
  /** Nicaraguan córdoba */
  | 'NIO'
  /** Norwegian krone */
  | 'NOK'
  /** Nepalese rupee */
  | 'NPR'
  /** New Zealand dollar */
  | 'NZD'
  /** Omani rial */
  | 'OMR'
  /** Panamanian balboa */
  | 'PAB'
  /** Peruvian sol */
  | 'PEN'
  /** Papua New Guinean kina */
  | 'PGK'
  /** Philippine peso */
  | 'PHP'
  /** Pakistani rupee */
  | 'PKR'
  /** Polish złoty */
  | 'PLN'
  /** Paraguayan guaraní */
  | 'PYG'
  /** Qatari riyal */
  | 'QAR'
  /** Romanian leu */
  | 'RON'
  /** Serbian dinar */
  | 'RSD'
  /** Russian ruble */
  | 'RUB'
  /** Rwandan franc */
  | 'RWF'
  /** Saudi riyal */
  | 'SAR'
  /** Solomon Islands dollar */
  | 'SBD'
  /** Seychelles rupee */
  | 'SCR'
  /** Sudanese pound */
  | 'SDG'
  /** Swedish krona/kronor */
  | 'SEK'
  /** Singapore dollar */
  | 'SGD'
  /** Saint Helena pound */
  | 'SHP'
  /** Sierra Leonean leone */
  | 'SLL'
  /** Somali shilling */
  | 'SOS'
  /** Surinamese dollar */
  | 'SRD'
  /** South Sudanese pound */
  | 'SSP'
  /** São Tomé and Príncipe dobra */
  | 'STN'
  /** Salvadoran colón */
  | 'SVC'
  /** Syrian pound */
  | 'SYP'
  /** Swazi lilangeni */
  | 'SZL'
  /** Thai baht */
  | 'THB'
  /** Tajikistani somoni */
  | 'TJS'
  /** Turkmenistan manat */
  | 'TMT'
  /** Tunisian dinar */
  | 'TND'
  /** Tongan paʻanga */
  | 'TOP'
  /** Turkish lira */
  | 'TRY'
  /** Trinidad and Tobago dollar */
  | 'TTD'
  /** New Taiwan dollar */
  | 'TWD'
  /** Tanzanian shilling */
  | 'TZS'
  /** Ukrainian hryvnia */
  | 'UAH'
  /** Ugandan shilling */
  | 'UGX'
  /** United States dollar */
  | 'USD'
  /** Uruguayan peso */
  | 'UYU'
  /** Uzbekistan som */
  | 'UZS'
  /** Venezuelan bolívar soberano */
  | 'VES'
  /** Vietnamese đồng */
  | 'VND'
  /** Vanuatu vatu */
  | 'VUV'
  /** Samoan tala */
  | 'WST'
  /** CFA franc BEAC */
  | 'XAF'
  /** East Caribbean dollar */
  | 'XCD'
  /** CFA franc BCEAO */
  | 'XOF'
  /** CFP franc (franc Pacifique) */
  | 'XPF'
  /** Yemeni rial */
  | 'YER'
  /** South African rand */
  | 'ZAR'
  /** Zambian kwacha */
  | 'ZMW'
  /** Zimbabwean dollar */
  | 'ZWL';

/** Operators for filtering on a DateTime field */
export type DateOperators = {
  after?: string | null | undefined;
  before?: string | null | undefined;
  between?: DateRange | null | undefined;
  eq?: string | null | undefined;
  isNull?: boolean | null | undefined;
};

export type DateRange = {
  end: string;
  start: string;
};

export type ErrorCode =
  | 'ALREADY_LOGGED_IN_ERROR'
  | 'COUPON_CODE_EXPIRED_ERROR'
  | 'COUPON_CODE_INVALID_ERROR'
  | 'COUPON_CODE_LIMIT_ERROR'
  | 'EMAIL_ADDRESS_CONFLICT_ERROR'
  | 'GUEST_CHECKOUT_ERROR'
  | 'IDENTIFIER_CHANGE_TOKEN_EXPIRED_ERROR'
  | 'IDENTIFIER_CHANGE_TOKEN_INVALID_ERROR'
  | 'INELIGIBLE_PAYMENT_METHOD_ERROR'
  | 'INELIGIBLE_SHIPPING_METHOD_ERROR'
  | 'INSUFFICIENT_STOCK_ERROR'
  | 'INVALID_CREDENTIALS_ERROR'
  | 'MISSING_PASSWORD_ERROR'
  | 'MOLLIE_PAYMENT_INTENT_ERROR'
  | 'NATIVE_AUTH_STRATEGY_ERROR'
  | 'NEGATIVE_QUANTITY_ERROR'
  | 'NOT_VERIFIED_ERROR'
  | 'NO_ACTIVE_ORDER_ERROR'
  | 'ORDER_INTERCEPTOR_ERROR'
  | 'ORDER_LIMIT_ERROR'
  | 'ORDER_MODIFICATION_ERROR'
  | 'ORDER_PAYMENT_STATE_ERROR'
  | 'ORDER_STATE_TRANSITION_ERROR'
  | 'PASSWORD_ALREADY_SET_ERROR'
  | 'PASSWORD_RESET_TOKEN_EXPIRED_ERROR'
  | 'PASSWORD_RESET_TOKEN_INVALID_ERROR'
  | 'PASSWORD_VALIDATION_ERROR'
  | 'PAYMENT_DECLINED_ERROR'
  | 'PAYMENT_FAILED_ERROR'
  | 'UNKNOWN_ERROR'
  | 'VERIFICATION_TOKEN_EXPIRED_ERROR'
  | 'VERIFICATION_TOKEN_INVALID_ERROR';

/**
 * Used to construct boolean expressions for filtering search results
 * by FacetValue ID. Examples:
 *
 * * ID=1 OR ID=2: `{ facetValueFilters: [{ or: [1,2] }] }`
 * * ID=1 AND ID=2: `{ facetValueFilters: [{ and: 1 }, { and: 2 }] }`
 * * ID=1 AND (ID=2 OR ID=3): `{ facetValueFilters: [{ and: 1 }, { or: [2,3] }] }`
 */
export type FacetValueFilterInput = {
  and?: string | number | null | undefined;
  or?: Array<string | number> | null | undefined;
};

/** Operators for filtering on an ID field */
export type IdOperators = {
  eq?: string | null | undefined;
  in?: Array<string> | null | undefined;
  isNull?: boolean | null | undefined;
  notEq?: string | null | undefined;
  notIn?: Array<string> | null | undefined;
};

/**
 * @description
 * Languages in the form of a ISO 639-1 language code with optional
 * region or script modifier (e.g. de_AT). The selection available is based
 * on the [Unicode CLDR summary list](https://unicode-org.github.io/cldr-staging/charts/37/summary/root.html)
 * and includes the major spoken languages of the world and any widely-used variants.
 *
 * @docsCategory common
 */
export type LanguageCode =
  /** Afrikaans */
  | 'af'
  /** Akan */
  | 'ak'
  /** Amharic */
  | 'am'
  /** Arabic */
  | 'ar'
  /** Assamese */
  | 'as'
  /** Azerbaijani */
  | 'az'
  /** Belarusian */
  | 'be'
  /** Bulgarian */
  | 'bg'
  /** Bambara */
  | 'bm'
  /** Bangla */
  | 'bn'
  /** Tibetan */
  | 'bo'
  /** Breton */
  | 'br'
  /** Bosnian */
  | 'bs'
  /** Catalan */
  | 'ca'
  /** Chechen */
  | 'ce'
  /** Corsican */
  | 'co'
  /** Czech */
  | 'cs'
  /** Church Slavic */
  | 'cu'
  /** Welsh */
  | 'cy'
  /** Danish */
  | 'da'
  /** German */
  | 'de'
  /** Austrian German */
  | 'de_AT'
  /** Swiss High German */
  | 'de_CH'
  /** Dzongkha */
  | 'dz'
  /** Ewe */
  | 'ee'
  /** Greek */
  | 'el'
  /** English */
  | 'en'
  /** Australian English */
  | 'en_AU'
  /** Canadian English */
  | 'en_CA'
  /** British English */
  | 'en_GB'
  /** American English */
  | 'en_US'
  /** Esperanto */
  | 'eo'
  /** Spanish */
  | 'es'
  /** European Spanish */
  | 'es_ES'
  /** Mexican Spanish */
  | 'es_MX'
  /** Estonian */
  | 'et'
  /** Basque */
  | 'eu'
  /** Persian */
  | 'fa'
  /** Dari */
  | 'fa_AF'
  /** Fulah */
  | 'ff'
  /** Finnish */
  | 'fi'
  /** Faroese */
  | 'fo'
  /** French */
  | 'fr'
  /** Canadian French */
  | 'fr_CA'
  /** Swiss French */
  | 'fr_CH'
  /** Western Frisian */
  | 'fy'
  /** Irish */
  | 'ga'
  /** Scottish Gaelic */
  | 'gd'
  /** Galician */
  | 'gl'
  /** Gujarati */
  | 'gu'
  /** Manx */
  | 'gv'
  /** Hausa */
  | 'ha'
  /** Hebrew */
  | 'he'
  /** Hindi */
  | 'hi'
  /** Croatian */
  | 'hr'
  /** Haitian Creole */
  | 'ht'
  /** Hungarian */
  | 'hu'
  /** Armenian */
  | 'hy'
  /** Interlingua */
  | 'ia'
  /** Indonesian */
  | 'id'
  /** Igbo */
  | 'ig'
  /** Sichuan Yi */
  | 'ii'
  /** Icelandic */
  | 'is'
  /** Italian */
  | 'it'
  /** Japanese */
  | 'ja'
  /** Javanese */
  | 'jv'
  /** Georgian */
  | 'ka'
  /** Kikuyu */
  | 'ki'
  /** Kazakh */
  | 'kk'
  /** Kalaallisut */
  | 'kl'
  /** Khmer */
  | 'km'
  /** Kannada */
  | 'kn'
  /** Korean */
  | 'ko'
  /** Kashmiri */
  | 'ks'
  /** Kurdish */
  | 'ku'
  /** Cornish */
  | 'kw'
  /** Kyrgyz */
  | 'ky'
  /** Latin */
  | 'la'
  /** Luxembourgish */
  | 'lb'
  /** Ganda */
  | 'lg'
  /** Lingala */
  | 'ln'
  /** Lao */
  | 'lo'
  /** Lithuanian */
  | 'lt'
  /** Luba-Katanga */
  | 'lu'
  /** Latvian */
  | 'lv'
  /** Malagasy */
  | 'mg'
  /** Maori */
  | 'mi'
  /** Macedonian */
  | 'mk'
  /** Malayalam */
  | 'ml'
  /** Mongolian */
  | 'mn'
  /** Marathi */
  | 'mr'
  /** Malay */
  | 'ms'
  /** Maltese */
  | 'mt'
  /** Burmese */
  | 'my'
  /** Norwegian Bokmål */
  | 'nb'
  /** North Ndebele */
  | 'nd'
  /** Nepali */
  | 'ne'
  /** Dutch */
  | 'nl'
  /** Flemish */
  | 'nl_BE'
  /** Norwegian Nynorsk */
  | 'nn'
  /** Nyanja */
  | 'ny'
  /** Oromo */
  | 'om'
  /** Odia */
  | 'or'
  /** Ossetic */
  | 'os'
  /** Punjabi */
  | 'pa'
  /** Polish */
  | 'pl'
  /** Pashto */
  | 'ps'
  /** Portuguese */
  | 'pt'
  /** Brazilian Portuguese */
  | 'pt_BR'
  /** European Portuguese */
  | 'pt_PT'
  /** Quechua */
  | 'qu'
  /** Romansh */
  | 'rm'
  /** Rundi */
  | 'rn'
  /** Romanian */
  | 'ro'
  /** Moldavian */
  | 'ro_MD'
  /** Russian */
  | 'ru'
  /** Kinyarwanda */
  | 'rw'
  /** Sanskrit */
  | 'sa'
  /** Sindhi */
  | 'sd'
  /** Northern Sami */
  | 'se'
  /** Sango */
  | 'sg'
  /** Sinhala */
  | 'si'
  /** Slovak */
  | 'sk'
  /** Slovenian */
  | 'sl'
  /** Samoan */
  | 'sm'
  /** Shona */
  | 'sn'
  /** Somali */
  | 'so'
  /** Albanian */
  | 'sq'
  /** Serbian */
  | 'sr'
  /** Southern Sotho */
  | 'st'
  /** Sundanese */
  | 'su'
  /** Swedish */
  | 'sv'
  /** Swahili */
  | 'sw'
  /** Congo Swahili */
  | 'sw_CD'
  /** Tamil */
  | 'ta'
  /** Telugu */
  | 'te'
  /** Tajik */
  | 'tg'
  /** Thai */
  | 'th'
  /** Tigrinya */
  | 'ti'
  /** Turkmen */
  | 'tk'
  /** Tongan */
  | 'to'
  /** Turkish */
  | 'tr'
  /** Tatar */
  | 'tt'
  /** Uyghur */
  | 'ug'
  /** Ukrainian */
  | 'uk'
  /** Urdu */
  | 'ur'
  /** Uzbek */
  | 'uz'
  /** Vietnamese */
  | 'vi'
  /** Volapük */
  | 'vo'
  /** Wolof */
  | 'wo'
  /** Xhosa */
  | 'xh'
  /** Yiddish */
  | 'yi'
  /** Yoruba */
  | 'yo'
  /** Chinese */
  | 'zh'
  /** Simplified Chinese */
  | 'zh_Hans'
  /** Traditional Chinese */
  | 'zh_Hant'
  /** Zulu */
  | 'zu';

export type LogicalOperator = 'AND' | 'OR';

/** Operators for filtering on a Int or Float field */
export type NumberOperators = {
  between?: NumberRange | null | undefined;
  eq?: number | null | undefined;
  gt?: number | null | undefined;
  gte?: number | null | undefined;
  isNull?: boolean | null | undefined;
  lt?: number | null | undefined;
  lte?: number | null | undefined;
};

export type NumberRange = {
  end: number;
  start: number;
};

export type OrderFilterParameter = {
  _and?: Array<OrderFilterParameter> | null | undefined;
  _or?: Array<OrderFilterParameter> | null | undefined;
  active?: BooleanOperators | null | undefined;
  code?: StringOperators | null | undefined;
  createdAt?: DateOperators | null | undefined;
  currencyCode?: StringOperators | null | undefined;
  id?: IdOperators | null | undefined;
  orderPlacedAt?: DateOperators | null | undefined;
  shipping?: NumberOperators | null | undefined;
  shippingWithTax?: NumberOperators | null | undefined;
  state?: StringOperators | null | undefined;
  subTotal?: NumberOperators | null | undefined;
  subTotalWithTax?: NumberOperators | null | undefined;
  total?: NumberOperators | null | undefined;
  totalQuantity?: NumberOperators | null | undefined;
  totalWithTax?: NumberOperators | null | undefined;
  type?: StringOperators | null | undefined;
  updatedAt?: DateOperators | null | undefined;
};

export type OrderListOptions = {
  /** Allows the results to be filtered */
  filter?: OrderFilterParameter | null | undefined;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: LogicalOperator | null | undefined;
  /** Skips the first n results, for use in pagination */
  skip?: number | null | undefined;
  /** Specifies which properties to sort the results by */
  sort?: OrderSortParameter | null | undefined;
  /** Takes n results, for use in pagination */
  take?: number | null | undefined;
};

export type OrderSortParameter = {
  code?: SortOrder | null | undefined;
  createdAt?: SortOrder | null | undefined;
  id?: SortOrder | null | undefined;
  orderPlacedAt?: SortOrder | null | undefined;
  shipping?: SortOrder | null | undefined;
  shippingWithTax?: SortOrder | null | undefined;
  state?: SortOrder | null | undefined;
  subTotal?: SortOrder | null | undefined;
  subTotalWithTax?: SortOrder | null | undefined;
  total?: SortOrder | null | undefined;
  totalQuantity?: SortOrder | null | undefined;
  totalWithTax?: SortOrder | null | undefined;
  updatedAt?: SortOrder | null | undefined;
};

/** Passed as input to the `addPaymentToOrder` mutation. */
export type PaymentInput = {
  /**
   * This field should contain arbitrary data passed to the specified PaymentMethodHandler's `createPayment()` method
   * as the "metadata" argument. For example, it could contain an ID for the payment and other
   * data generated by the payment provider.
   */
  metadata: unknown;
  /** This field should correspond to the `code` property of a PaymentMethod. */
  method: string;
};

/**
 * @description
 * Permissions for administrators and customers. Used to control access to
 * GraphQL resolvers via the {@link Allow} decorator.
 *
 * ## Understanding Permission.Owner
 *
 * `Permission.Owner` is a special permission which is used in some Vendure resolvers to indicate that that resolver should only
 * be accessible to the "owner" of that resource.
 *
 * For example, the Shop API `activeCustomer` query resolver should only return the Customer object for the "owner" of that Customer, i.e.
 * based on the activeUserId of the current session. As a result, the resolver code looks like this:
 *
 * @example
 * ```TypeScript
 * \@Query()
 * \@Allow(Permission.Owner)
 * async activeCustomer(\@Ctx() ctx: RequestContext): Promise<Customer | undefined> {
 *   const userId = ctx.activeUserId;
 *   if (userId) {
 *     return this.customerService.findOneByUserId(ctx, userId);
 *   }
 * }
 * ```
 *
 * Here we can see that the "ownership" must be enforced by custom logic inside the resolver. Since "ownership" cannot be defined generally
 * nor statically encoded at build-time, any resolvers using `Permission.Owner` **must** include logic to enforce that only the owner
 * of the resource has access. If not, then it is the equivalent of using `Permission.Public`.
 *
 *
 * @docsCategory common
 */
export type Permission =
  /** Authenticated means simply that the user is logged in */
  | 'Authenticated'
  /** Grants permission to create Administrator */
  | 'CreateAdministrator'
  /** Grants permission to create ApiKey */
  | 'CreateApiKey'
  /** Grants permission to create Asset */
  | 'CreateAsset'
  /** Grants permission to create Products, Facets, Assets, Collections */
  | 'CreateCatalog'
  /** Grants permission to create Channel */
  | 'CreateChannel'
  /** Grants permission to create Collection */
  | 'CreateCollection'
  /** Grants permission to create Country */
  | 'CreateCountry'
  /** Grants permission to create Customer */
  | 'CreateCustomer'
  /** Grants permission to create CustomerGroup */
  | 'CreateCustomerGroup'
  /** Grants permission to create Facet */
  | 'CreateFacet'
  /** Grants permission to create Order */
  | 'CreateOrder'
  /** Grants permission to create PaymentMethod */
  | 'CreatePaymentMethod'
  /** Grants permission to create Product */
  | 'CreateProduct'
  /** Grants permission to create Promotion */
  | 'CreatePromotion'
  /** Grants permission to create Seller */
  | 'CreateSeller'
  /** Grants permission to create PaymentMethods, ShippingMethods, TaxCategories, TaxRates, Zones, Countries, System & GlobalSettings */
  | 'CreateSettings'
  /** Grants permission to create ShippingMethod */
  | 'CreateShippingMethod'
  /** Grants permission to create StockLocation */
  | 'CreateStockLocation'
  /** Grants permission to create System */
  | 'CreateSystem'
  /** Grants permission to create Tag */
  | 'CreateTag'
  /** Grants permission to create TaxCategory */
  | 'CreateTaxCategory'
  /** Grants permission to create TaxRate */
  | 'CreateTaxRate'
  /** Grants permission to create Zone */
  | 'CreateZone'
  /** Grants permission to delete Administrator */
  | 'DeleteAdministrator'
  /** Grants permission to delete ApiKey */
  | 'DeleteApiKey'
  /** Grants permission to delete Asset */
  | 'DeleteAsset'
  /** Grants permission to delete Products, Facets, Assets, Collections */
  | 'DeleteCatalog'
  /** Grants permission to delete Channel */
  | 'DeleteChannel'
  /** Grants permission to delete Collection */
  | 'DeleteCollection'
  /** Grants permission to delete Country */
  | 'DeleteCountry'
  /** Grants permission to delete Customer */
  | 'DeleteCustomer'
  /** Grants permission to delete CustomerGroup */
  | 'DeleteCustomerGroup'
  /** Grants permission to delete Facet */
  | 'DeleteFacet'
  /** Grants permission to delete Order */
  | 'DeleteOrder'
  /** Grants permission to delete PaymentMethod */
  | 'DeletePaymentMethod'
  /** Grants permission to delete Product */
  | 'DeleteProduct'
  /** Grants permission to delete Promotion */
  | 'DeletePromotion'
  /** Grants permission to delete Seller */
  | 'DeleteSeller'
  /** Grants permission to delete PaymentMethods, ShippingMethods, TaxCategories, TaxRates, Zones, Countries, System & GlobalSettings */
  | 'DeleteSettings'
  /** Grants permission to delete ShippingMethod */
  | 'DeleteShippingMethod'
  /** Grants permission to delete StockLocation */
  | 'DeleteStockLocation'
  /** Grants permission to delete System */
  | 'DeleteSystem'
  /** Grants permission to delete Tag */
  | 'DeleteTag'
  /** Grants permission to delete TaxCategory */
  | 'DeleteTaxCategory'
  /** Grants permission to delete TaxRate */
  | 'DeleteTaxRate'
  /** Grants permission to delete Zone */
  | 'DeleteZone'
  /** Owner means the user owns this entity, e.g. a Customer's own Order */
  | 'Owner'
  /** Public means any unauthenticated user may perform the operation */
  | 'Public'
  /** Grants permission to read Administrator */
  | 'ReadAdministrator'
  /** Grants permission to read ApiKey */
  | 'ReadApiKey'
  /** Grants permission to read Asset */
  | 'ReadAsset'
  /** Grants permission to read Products, Facets, Assets, Collections */
  | 'ReadCatalog'
  /** Grants permission to read Channel */
  | 'ReadChannel'
  /** Grants permission to read Collection */
  | 'ReadCollection'
  /** Grants permission to read Country */
  | 'ReadCountry'
  /** Grants permission to read Customer */
  | 'ReadCustomer'
  /** Grants permission to read CustomerGroup */
  | 'ReadCustomerGroup'
  /** Grants permission to read Facet */
  | 'ReadFacet'
  /** Grants permission to read Order */
  | 'ReadOrder'
  /** Grants permission to read PaymentMethod */
  | 'ReadPaymentMethod'
  /** Grants permission to read Product */
  | 'ReadProduct'
  /** Grants permission to read Promotion */
  | 'ReadPromotion'
  /** Grants permission to read Seller */
  | 'ReadSeller'
  /** Grants permission to read PaymentMethods, ShippingMethods, TaxCategories, TaxRates, Zones, Countries, System & GlobalSettings */
  | 'ReadSettings'
  /** Grants permission to read ShippingMethod */
  | 'ReadShippingMethod'
  /** Grants permission to read StockLocation */
  | 'ReadStockLocation'
  /** Grants permission to read System */
  | 'ReadSystem'
  /** Grants permission to read Tag */
  | 'ReadTag'
  /** Grants permission to read TaxCategory */
  | 'ReadTaxCategory'
  /** Grants permission to read TaxRate */
  | 'ReadTaxRate'
  /** Grants permission to read Zone */
  | 'ReadZone'
  /** SuperAdmin has unrestricted access to all operations */
  | 'SuperAdmin'
  /** Grants permission to update Administrator */
  | 'UpdateAdministrator'
  /** Grants permission to update ApiKey */
  | 'UpdateApiKey'
  /** Grants permission to update Asset */
  | 'UpdateAsset'
  /** Grants permission to update Products, Facets, Assets, Collections */
  | 'UpdateCatalog'
  /** Grants permission to update Channel */
  | 'UpdateChannel'
  /** Grants permission to update Collection */
  | 'UpdateCollection'
  /** Grants permission to update Country */
  | 'UpdateCountry'
  /** Grants permission to update Customer */
  | 'UpdateCustomer'
  /** Grants permission to update CustomerGroup */
  | 'UpdateCustomerGroup'
  /** Grants permission to update Facet */
  | 'UpdateFacet'
  /** Grants permission to update GlobalSettings */
  | 'UpdateGlobalSettings'
  /** Grants permission to update Order */
  | 'UpdateOrder'
  /** Grants permission to update PaymentMethod */
  | 'UpdatePaymentMethod'
  /** Grants permission to update Product */
  | 'UpdateProduct'
  /** Grants permission to update Promotion */
  | 'UpdatePromotion'
  /** Grants permission to update Seller */
  | 'UpdateSeller'
  /** Grants permission to update PaymentMethods, ShippingMethods, TaxCategories, TaxRates, Zones, Countries, System & GlobalSettings */
  | 'UpdateSettings'
  /** Grants permission to update ShippingMethod */
  | 'UpdateShippingMethod'
  /** Grants permission to update StockLocation */
  | 'UpdateStockLocation'
  /** Grants permission to update System */
  | 'UpdateSystem'
  /** Grants permission to update Tag */
  | 'UpdateTag'
  /** Grants permission to update TaxCategory */
  | 'UpdateTaxCategory'
  /** Grants permission to update TaxRate */
  | 'UpdateTaxRate'
  /** Grants permission to update Zone */
  | 'UpdateZone';

export type ProductFilterParameter = {
  _and?: Array<ProductFilterParameter> | null | undefined;
  _or?: Array<ProductFilterParameter> | null | undefined;
  activity?: StringListOperators | null | undefined;
  careInstructions?: StringOperators | null | undefined;
  createdAt?: DateOperators | null | undefined;
  description?: StringOperators | null | undefined;
  enabled?: BooleanOperators | null | undefined;
  id?: IdOperators | null | undefined;
  languageCode?: StringOperators | null | undefined;
  manufacturerInfo?: StringOperators | null | undefined;
  materialComposition?: StringOperators | null | undefined;
  name?: StringOperators | null | undefined;
  slug?: StringOperators | null | undefined;
  sustainabilityNotes?: StringOperators | null | undefined;
  traceabilityCode?: StringOperators | null | undefined;
  updatedAt?: DateOperators | null | undefined;
  warnings?: StringOperators | null | undefined;
};

export type ProductListOptions = {
  /** Allows the results to be filtered */
  filter?: ProductFilterParameter | null | undefined;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: LogicalOperator | null | undefined;
  /** Skips the first n results, for use in pagination */
  skip?: number | null | undefined;
  /** Specifies which properties to sort the results by */
  sort?: ProductSortParameter | null | undefined;
  /** Takes n results, for use in pagination */
  take?: number | null | undefined;
};

export type ProductSortParameter = {
  careInstructions?: SortOrder | null | undefined;
  createdAt?: SortOrder | null | undefined;
  description?: SortOrder | null | undefined;
  id?: SortOrder | null | undefined;
  manufacturerInfo?: SortOrder | null | undefined;
  materialComposition?: SortOrder | null | undefined;
  name?: SortOrder | null | undefined;
  responsiblePerson?: SortOrder | null | undefined;
  slug?: SortOrder | null | undefined;
  sustainabilityNotes?: SortOrder | null | undefined;
  traceabilityCode?: SortOrder | null | undefined;
  updatedAt?: SortOrder | null | undefined;
  warnings?: SortOrder | null | undefined;
};

export type RegisterCustomerCustomFieldsInput = {
  marketingOptIn?: boolean | null | undefined;
  marketingOptInAt?: string | null | undefined;
  preferredActivity?: string | null | undefined;
};

export type RegisterCustomerInput = {
  customFields?: RegisterCustomerCustomFieldsInput | null | undefined;
  emailAddress: string;
  firstName?: string | null | undefined;
  lastName?: string | null | undefined;
  password?: string | null | undefined;
  phoneNumber?: string | null | undefined;
  title?: string | null | undefined;
};

export type SearchInput = {
  collectionId?: string | number | null | undefined;
  collectionIds?: Array<string | number> | null | undefined;
  collectionSlug?: string | null | undefined;
  collectionSlugs?: Array<string> | null | undefined;
  facetValueFilters?: Array<FacetValueFilterInput> | null | undefined;
  groupByProduct?: boolean | null | undefined;
  skip?: number | null | undefined;
  sort?: SearchResultSortParameter | null | undefined;
  take?: number | null | undefined;
  term?: string | null | undefined;
};

export type SearchResultSortParameter = {
  name?: SortOrder | null | undefined;
  price?: SortOrder | null | undefined;
};

export type SortOrder = 'ASC' | 'DESC';

/** Operators for filtering on a list of String fields */
export type StringListOperators = {
  inList: string;
};

/** Operators for filtering on a String field */
export type StringOperators = {
  contains?: string | null | undefined;
  eq?: string | null | undefined;
  in?: Array<string> | null | undefined;
  isNull?: boolean | null | undefined;
  notContains?: string | null | undefined;
  notEq?: string | null | undefined;
  notIn?: Array<string> | null | undefined;
  regex?: string | null | undefined;
};

/**
 * Input used to update an Address.
 *
 * The countryCode must correspond to a `code` property of a Country that has been defined in the
 * Vendure server. The `code` property is typically a 2-character ISO code such as "GB", "US", "DE" etc.
 * If an invalid code is passed, the mutation will fail.
 */
export type UpdateAddressInput = {
  city?: string | null | undefined;
  company?: string | null | undefined;
  countryCode?: string | null | undefined;
  customFields?: unknown;
  defaultBillingAddress?: boolean | null | undefined;
  defaultShippingAddress?: boolean | null | undefined;
  fullName?: string | null | undefined;
  id: string | number;
  phoneNumber?: string | null | undefined;
  postalCode?: string | null | undefined;
  province?: string | null | undefined;
  streetLine1?: string | null | undefined;
  streetLine2?: string | null | undefined;
};

export type UpdateCustomerCustomFieldsInput = {
  marketingOptIn?: boolean | null | undefined;
  marketingOptInAt?: string | null | undefined;
  preferredActivity?: string | null | undefined;
};

export type UpdateCustomerInput = {
  customFields?: UpdateCustomerCustomFieldsInput | null | undefined;
  firstName?: string | null | undefined;
  lastName?: string | null | undefined;
  phoneNumber?: string | null | undefined;
  title?: string | null | undefined;
};

export type CreateCustomerAddressMutationVariables = Exact<{
  input: CreateAddressInput;
}>;

export type CreateCustomerAddressMutation = {
  createCustomerAddress: {
    id: string;
    fullName: string | null;
    company: string | null;
    streetLine1: string;
    streetLine2: string | null;
    city: string | null;
    province: string | null;
    postalCode: string | null;
    phoneNumber: string | null;
    defaultShippingAddress: boolean | null;
    defaultBillingAddress: boolean | null;
    country: { id: string; code: string; name: string };
  };
};

export type UpdateCustomerAddressMutationVariables = Exact<{
  input: UpdateAddressInput;
}>;

export type UpdateCustomerAddressMutation = {
  updateCustomerAddress: {
    id: string;
    fullName: string | null;
    company: string | null;
    streetLine1: string;
    streetLine2: string | null;
    city: string | null;
    province: string | null;
    postalCode: string | null;
    phoneNumber: string | null;
    defaultShippingAddress: boolean | null;
    defaultBillingAddress: boolean | null;
    country: { id: string; code: string; name: string };
  };
};

export type DeleteCustomerAddressMutationVariables = Exact<{
  id: string | number;
}>;

export type DeleteCustomerAddressMutation = { deleteCustomerAddress: { success: boolean } };

export type ChannelFieldsFragment = {
  id: string;
  code: string;
  token: string;
  defaultLanguageCode: LanguageCode;
  availableLanguageCodes: Array<LanguageCode> | null;
  defaultCurrencyCode: CurrencyCode;
  availableCurrencyCodes: Array<CurrencyCode>;
  pricesIncludeTax: boolean;
  defaultTaxZone: { id: string; name: string } | null;
  defaultShippingZone: { id: string; name: string } | null;
};

export type CountryFieldsFragment = {
  id: string;
  code: string;
  name: string;
  enabled: boolean;
  languageCode: LanguageCode;
};

export type ActiveChannelQueryVariables = Exact<{ [key: string]: never }>;

export type ActiveChannelQuery = {
  activeChannel: {
    id: string;
    code: string;
    token: string;
    defaultLanguageCode: LanguageCode;
    availableLanguageCodes: Array<LanguageCode> | null;
    defaultCurrencyCode: CurrencyCode;
    availableCurrencyCodes: Array<CurrencyCode>;
    pricesIncludeTax: boolean;
    defaultTaxZone: { id: string; name: string } | null;
    defaultShippingZone: { id: string; name: string } | null;
  };
};

export type AvailableCountriesQueryVariables = Exact<{ [key: string]: never }>;

export type AvailableCountriesQuery = {
  availableCountries: Array<{
    id: string;
    code: string;
    name: string;
    enabled: boolean;
    languageCode: LanguageCode;
  }>;
};

export type ShippingMethodQuoteFieldsFragment = {
  id: string;
  code: string;
  name: string;
  description: string;
  price: number;
  priceWithTax: number;
};

export type PaymentMethodQuoteFieldsFragment = {
  id: string;
  code: string;
  name: string;
  description: string;
  isEligible: boolean;
  eligibilityMessage: string | null;
};

export type AddItemToOrderMutationVariables = Exact<{
  productVariantId: string | number;
  quantity: number;
}>;

export type AddItemToOrderMutation = {
  addItemToOrder:
    | { __typename: 'InsufficientStockError'; errorCode: ErrorCode; message: string }
    | { __typename: 'NegativeQuantityError'; errorCode: ErrorCode; message: string }
    | {
        __typename: 'Order';
        id: string;
        code: string;
        state: string;
        active: boolean;
        totalQuantity: number;
        currencyCode: CurrencyCode;
        subTotal: number;
        subTotalWithTax: number;
        shipping: number;
        shippingWithTax: number;
        total: number;
        totalWithTax: number;
        orderPlacedAt: string | null;
        couponCodes: Array<string>;
        customer: { id: string; firstName: string; lastName: string; emailAddress: string } | null;
        shippingAddress: {
          fullName: string | null;
          company: string | null;
          streetLine1: string | null;
          streetLine2: string | null;
          city: string | null;
          province: string | null;
          postalCode: string | null;
          country: string | null;
          countryCode: string | null;
          phoneNumber: string | null;
        } | null;
        billingAddress: {
          fullName: string | null;
          company: string | null;
          streetLine1: string | null;
          streetLine2: string | null;
          city: string | null;
          province: string | null;
          postalCode: string | null;
          country: string | null;
          countryCode: string | null;
          phoneNumber: string | null;
        } | null;
        shippingLines: Array<{
          id: string;
          priceWithTax: number;
          shippingMethod: { id: string; code: string; name: string; description: string };
        }>;
        payments: Array<{
          id: string;
          method: string;
          amount: number;
          state: string;
          transactionId: string | null;
          errorMessage: string | null;
          metadata: unknown;
        }> | null;
        discounts: Array<{
          description: string;
          amount: number;
          amountWithTax: number;
          type: AdjustmentType;
        }>;
        lines: Array<{
          id: string;
          quantity: number;
          unitPriceWithTax: number;
          discountedUnitPriceWithTax: number;
          linePriceWithTax: number;
          discountedLinePriceWithTax: number;
          productVariant: {
            id: string;
            sku: string;
            name: string;
            price: number;
            priceWithTax: number;
            currencyCode: CurrencyCode;
            product: { id: string; name: string; slug: string };
            options: Array<{ id: string; code: string; name: string; groupId: string }>;
          };
          featuredAsset: {
            id: string;
            name: string;
            source: string;
            preview: string;
            width: number;
            height: number;
            mimeType: string;
            type: AssetType;
          } | null;
        }>;
      }
    | { __typename: 'OrderInterceptorError'; errorCode: ErrorCode; message: string }
    | { __typename: 'OrderLimitError'; errorCode: ErrorCode; message: string }
    | { __typename: 'OrderModificationError'; errorCode: ErrorCode; message: string };
};

export type AdjustOrderLineMutationVariables = Exact<{
  orderLineId: string | number;
  quantity: number;
}>;

export type AdjustOrderLineMutation = {
  adjustOrderLine:
    | { __typename: 'InsufficientStockError'; errorCode: ErrorCode; message: string }
    | { __typename: 'NegativeQuantityError'; errorCode: ErrorCode; message: string }
    | {
        __typename: 'Order';
        id: string;
        code: string;
        state: string;
        active: boolean;
        totalQuantity: number;
        currencyCode: CurrencyCode;
        subTotal: number;
        subTotalWithTax: number;
        shipping: number;
        shippingWithTax: number;
        total: number;
        totalWithTax: number;
        orderPlacedAt: string | null;
        couponCodes: Array<string>;
        customer: { id: string; firstName: string; lastName: string; emailAddress: string } | null;
        shippingAddress: {
          fullName: string | null;
          company: string | null;
          streetLine1: string | null;
          streetLine2: string | null;
          city: string | null;
          province: string | null;
          postalCode: string | null;
          country: string | null;
          countryCode: string | null;
          phoneNumber: string | null;
        } | null;
        billingAddress: {
          fullName: string | null;
          company: string | null;
          streetLine1: string | null;
          streetLine2: string | null;
          city: string | null;
          province: string | null;
          postalCode: string | null;
          country: string | null;
          countryCode: string | null;
          phoneNumber: string | null;
        } | null;
        shippingLines: Array<{
          id: string;
          priceWithTax: number;
          shippingMethod: { id: string; code: string; name: string; description: string };
        }>;
        payments: Array<{
          id: string;
          method: string;
          amount: number;
          state: string;
          transactionId: string | null;
          errorMessage: string | null;
          metadata: unknown;
        }> | null;
        discounts: Array<{
          description: string;
          amount: number;
          amountWithTax: number;
          type: AdjustmentType;
        }>;
        lines: Array<{
          id: string;
          quantity: number;
          unitPriceWithTax: number;
          discountedUnitPriceWithTax: number;
          linePriceWithTax: number;
          discountedLinePriceWithTax: number;
          productVariant: {
            id: string;
            sku: string;
            name: string;
            price: number;
            priceWithTax: number;
            currencyCode: CurrencyCode;
            product: { id: string; name: string; slug: string };
            options: Array<{ id: string; code: string; name: string; groupId: string }>;
          };
          featuredAsset: {
            id: string;
            name: string;
            source: string;
            preview: string;
            width: number;
            height: number;
            mimeType: string;
            type: AssetType;
          } | null;
        }>;
      }
    | { __typename: 'OrderInterceptorError'; errorCode: ErrorCode; message: string }
    | { __typename: 'OrderLimitError'; errorCode: ErrorCode; message: string }
    | { __typename: 'OrderModificationError'; errorCode: ErrorCode; message: string };
};

export type RemoveOrderLineMutationVariables = Exact<{
  orderLineId: string | number;
}>;

export type RemoveOrderLineMutation = {
  removeOrderLine:
    | {
        __typename: 'Order';
        id: string;
        code: string;
        state: string;
        active: boolean;
        totalQuantity: number;
        currencyCode: CurrencyCode;
        subTotal: number;
        subTotalWithTax: number;
        shipping: number;
        shippingWithTax: number;
        total: number;
        totalWithTax: number;
        orderPlacedAt: string | null;
        couponCodes: Array<string>;
        customer: { id: string; firstName: string; lastName: string; emailAddress: string } | null;
        shippingAddress: {
          fullName: string | null;
          company: string | null;
          streetLine1: string | null;
          streetLine2: string | null;
          city: string | null;
          province: string | null;
          postalCode: string | null;
          country: string | null;
          countryCode: string | null;
          phoneNumber: string | null;
        } | null;
        billingAddress: {
          fullName: string | null;
          company: string | null;
          streetLine1: string | null;
          streetLine2: string | null;
          city: string | null;
          province: string | null;
          postalCode: string | null;
          country: string | null;
          countryCode: string | null;
          phoneNumber: string | null;
        } | null;
        shippingLines: Array<{
          id: string;
          priceWithTax: number;
          shippingMethod: { id: string; code: string; name: string; description: string };
        }>;
        payments: Array<{
          id: string;
          method: string;
          amount: number;
          state: string;
          transactionId: string | null;
          errorMessage: string | null;
          metadata: unknown;
        }> | null;
        discounts: Array<{
          description: string;
          amount: number;
          amountWithTax: number;
          type: AdjustmentType;
        }>;
        lines: Array<{
          id: string;
          quantity: number;
          unitPriceWithTax: number;
          discountedUnitPriceWithTax: number;
          linePriceWithTax: number;
          discountedLinePriceWithTax: number;
          productVariant: {
            id: string;
            sku: string;
            name: string;
            price: number;
            priceWithTax: number;
            currencyCode: CurrencyCode;
            product: { id: string; name: string; slug: string };
            options: Array<{ id: string; code: string; name: string; groupId: string }>;
          };
          featuredAsset: {
            id: string;
            name: string;
            source: string;
            preview: string;
            width: number;
            height: number;
            mimeType: string;
            type: AssetType;
          } | null;
        }>;
      }
    | { __typename: 'OrderInterceptorError'; errorCode: ErrorCode; message: string }
    | { __typename: 'OrderModificationError'; errorCode: ErrorCode; message: string };
};

export type RemoveAllOrderLinesMutationVariables = Exact<{ [key: string]: never }>;

export type RemoveAllOrderLinesMutation = {
  removeAllOrderLines:
    | {
        __typename: 'Order';
        id: string;
        code: string;
        state: string;
        active: boolean;
        totalQuantity: number;
        currencyCode: CurrencyCode;
        subTotal: number;
        subTotalWithTax: number;
        shipping: number;
        shippingWithTax: number;
        total: number;
        totalWithTax: number;
        orderPlacedAt: string | null;
        couponCodes: Array<string>;
        customer: { id: string; firstName: string; lastName: string; emailAddress: string } | null;
        shippingAddress: {
          fullName: string | null;
          company: string | null;
          streetLine1: string | null;
          streetLine2: string | null;
          city: string | null;
          province: string | null;
          postalCode: string | null;
          country: string | null;
          countryCode: string | null;
          phoneNumber: string | null;
        } | null;
        billingAddress: {
          fullName: string | null;
          company: string | null;
          streetLine1: string | null;
          streetLine2: string | null;
          city: string | null;
          province: string | null;
          postalCode: string | null;
          country: string | null;
          countryCode: string | null;
          phoneNumber: string | null;
        } | null;
        shippingLines: Array<{
          id: string;
          priceWithTax: number;
          shippingMethod: { id: string; code: string; name: string; description: string };
        }>;
        payments: Array<{
          id: string;
          method: string;
          amount: number;
          state: string;
          transactionId: string | null;
          errorMessage: string | null;
          metadata: unknown;
        }> | null;
        discounts: Array<{
          description: string;
          amount: number;
          amountWithTax: number;
          type: AdjustmentType;
        }>;
        lines: Array<{
          id: string;
          quantity: number;
          unitPriceWithTax: number;
          discountedUnitPriceWithTax: number;
          linePriceWithTax: number;
          discountedLinePriceWithTax: number;
          productVariant: {
            id: string;
            sku: string;
            name: string;
            price: number;
            priceWithTax: number;
            currencyCode: CurrencyCode;
            product: { id: string; name: string; slug: string };
            options: Array<{ id: string; code: string; name: string; groupId: string }>;
          };
          featuredAsset: {
            id: string;
            name: string;
            source: string;
            preview: string;
            width: number;
            height: number;
            mimeType: string;
            type: AssetType;
          } | null;
        }>;
      }
    | { __typename: 'OrderInterceptorError'; errorCode: ErrorCode; message: string }
    | { __typename: 'OrderModificationError'; errorCode: ErrorCode; message: string };
};

export type ApplyCouponCodeMutationVariables = Exact<{
  couponCode: string;
}>;

export type ApplyCouponCodeMutation = {
  applyCouponCode:
    | { __typename: 'CouponCodeExpiredError'; errorCode: ErrorCode; message: string }
    | { __typename: 'CouponCodeInvalidError'; errorCode: ErrorCode; message: string }
    | { __typename: 'CouponCodeLimitError'; errorCode: ErrorCode; message: string }
    | {
        __typename: 'Order';
        id: string;
        code: string;
        state: string;
        active: boolean;
        totalQuantity: number;
        currencyCode: CurrencyCode;
        subTotal: number;
        subTotalWithTax: number;
        shipping: number;
        shippingWithTax: number;
        total: number;
        totalWithTax: number;
        orderPlacedAt: string | null;
        couponCodes: Array<string>;
        customer: { id: string; firstName: string; lastName: string; emailAddress: string } | null;
        shippingAddress: {
          fullName: string | null;
          company: string | null;
          streetLine1: string | null;
          streetLine2: string | null;
          city: string | null;
          province: string | null;
          postalCode: string | null;
          country: string | null;
          countryCode: string | null;
          phoneNumber: string | null;
        } | null;
        billingAddress: {
          fullName: string | null;
          company: string | null;
          streetLine1: string | null;
          streetLine2: string | null;
          city: string | null;
          province: string | null;
          postalCode: string | null;
          country: string | null;
          countryCode: string | null;
          phoneNumber: string | null;
        } | null;
        shippingLines: Array<{
          id: string;
          priceWithTax: number;
          shippingMethod: { id: string; code: string; name: string; description: string };
        }>;
        payments: Array<{
          id: string;
          method: string;
          amount: number;
          state: string;
          transactionId: string | null;
          errorMessage: string | null;
          metadata: unknown;
        }> | null;
        discounts: Array<{
          description: string;
          amount: number;
          amountWithTax: number;
          type: AdjustmentType;
        }>;
        lines: Array<{
          id: string;
          quantity: number;
          unitPriceWithTax: number;
          discountedUnitPriceWithTax: number;
          linePriceWithTax: number;
          discountedLinePriceWithTax: number;
          productVariant: {
            id: string;
            sku: string;
            name: string;
            price: number;
            priceWithTax: number;
            currencyCode: CurrencyCode;
            product: { id: string; name: string; slug: string };
            options: Array<{ id: string; code: string; name: string; groupId: string }>;
          };
          featuredAsset: {
            id: string;
            name: string;
            source: string;
            preview: string;
            width: number;
            height: number;
            mimeType: string;
            type: AssetType;
          } | null;
        }>;
      };
};

export type RemoveCouponCodeMutationVariables = Exact<{
  couponCode: string;
}>;

export type RemoveCouponCodeMutation = {
  removeCouponCode: {
    id: string;
    code: string;
    state: string;
    active: boolean;
    totalQuantity: number;
    currencyCode: CurrencyCode;
    subTotal: number;
    subTotalWithTax: number;
    shipping: number;
    shippingWithTax: number;
    total: number;
    totalWithTax: number;
    orderPlacedAt: string | null;
    couponCodes: Array<string>;
    customer: { id: string; firstName: string; lastName: string; emailAddress: string } | null;
    shippingAddress: {
      fullName: string | null;
      company: string | null;
      streetLine1: string | null;
      streetLine2: string | null;
      city: string | null;
      province: string | null;
      postalCode: string | null;
      country: string | null;
      countryCode: string | null;
      phoneNumber: string | null;
    } | null;
    billingAddress: {
      fullName: string | null;
      company: string | null;
      streetLine1: string | null;
      streetLine2: string | null;
      city: string | null;
      province: string | null;
      postalCode: string | null;
      country: string | null;
      countryCode: string | null;
      phoneNumber: string | null;
    } | null;
    shippingLines: Array<{
      id: string;
      priceWithTax: number;
      shippingMethod: { id: string; code: string; name: string; description: string };
    }>;
    payments: Array<{
      id: string;
      method: string;
      amount: number;
      state: string;
      transactionId: string | null;
      errorMessage: string | null;
      metadata: unknown;
    }> | null;
    discounts: Array<{
      description: string;
      amount: number;
      amountWithTax: number;
      type: AdjustmentType;
    }>;
    lines: Array<{
      id: string;
      quantity: number;
      unitPriceWithTax: number;
      discountedUnitPriceWithTax: number;
      linePriceWithTax: number;
      discountedLinePriceWithTax: number;
      productVariant: {
        id: string;
        sku: string;
        name: string;
        price: number;
        priceWithTax: number;
        currencyCode: CurrencyCode;
        product: { id: string; name: string; slug: string };
        options: Array<{ id: string; code: string; name: string; groupId: string }>;
      };
      featuredAsset: {
        id: string;
        name: string;
        source: string;
        preview: string;
        width: number;
        height: number;
        mimeType: string;
        type: AssetType;
      } | null;
    }>;
  } | null;
};

export type SetCustomerForOrderMutationVariables = Exact<{
  input: CreateCustomerInput;
}>;

export type SetCustomerForOrderMutation = {
  setCustomerForOrder:
    | { __typename: 'AlreadyLoggedInError'; errorCode: ErrorCode; message: string }
    | { __typename: 'EmailAddressConflictError'; errorCode: ErrorCode; message: string }
    | { __typename: 'GuestCheckoutError'; errorCode: ErrorCode; message: string }
    | { __typename: 'NoActiveOrderError'; errorCode: ErrorCode; message: string }
    | {
        __typename: 'Order';
        id: string;
        code: string;
        state: string;
        active: boolean;
        totalQuantity: number;
        currencyCode: CurrencyCode;
        subTotal: number;
        subTotalWithTax: number;
        shipping: number;
        shippingWithTax: number;
        total: number;
        totalWithTax: number;
        orderPlacedAt: string | null;
        couponCodes: Array<string>;
        customer: { id: string; firstName: string; lastName: string; emailAddress: string } | null;
        shippingAddress: {
          fullName: string | null;
          company: string | null;
          streetLine1: string | null;
          streetLine2: string | null;
          city: string | null;
          province: string | null;
          postalCode: string | null;
          country: string | null;
          countryCode: string | null;
          phoneNumber: string | null;
        } | null;
        billingAddress: {
          fullName: string | null;
          company: string | null;
          streetLine1: string | null;
          streetLine2: string | null;
          city: string | null;
          province: string | null;
          postalCode: string | null;
          country: string | null;
          countryCode: string | null;
          phoneNumber: string | null;
        } | null;
        shippingLines: Array<{
          id: string;
          priceWithTax: number;
          shippingMethod: { id: string; code: string; name: string; description: string };
        }>;
        payments: Array<{
          id: string;
          method: string;
          amount: number;
          state: string;
          transactionId: string | null;
          errorMessage: string | null;
          metadata: unknown;
        }> | null;
        discounts: Array<{
          description: string;
          amount: number;
          amountWithTax: number;
          type: AdjustmentType;
        }>;
        lines: Array<{
          id: string;
          quantity: number;
          unitPriceWithTax: number;
          discountedUnitPriceWithTax: number;
          linePriceWithTax: number;
          discountedLinePriceWithTax: number;
          productVariant: {
            id: string;
            sku: string;
            name: string;
            price: number;
            priceWithTax: number;
            currencyCode: CurrencyCode;
            product: { id: string; name: string; slug: string };
            options: Array<{ id: string; code: string; name: string; groupId: string }>;
          };
          featuredAsset: {
            id: string;
            name: string;
            source: string;
            preview: string;
            width: number;
            height: number;
            mimeType: string;
            type: AssetType;
          } | null;
        }>;
      };
};

export type SetOrderShippingAddressMutationVariables = Exact<{
  input: CreateAddressInput;
}>;

export type SetOrderShippingAddressMutation = {
  setOrderShippingAddress:
    | { __typename: 'NoActiveOrderError'; errorCode: ErrorCode; message: string }
    | {
        __typename: 'Order';
        id: string;
        code: string;
        state: string;
        active: boolean;
        totalQuantity: number;
        currencyCode: CurrencyCode;
        subTotal: number;
        subTotalWithTax: number;
        shipping: number;
        shippingWithTax: number;
        total: number;
        totalWithTax: number;
        orderPlacedAt: string | null;
        couponCodes: Array<string>;
        customer: { id: string; firstName: string; lastName: string; emailAddress: string } | null;
        shippingAddress: {
          fullName: string | null;
          company: string | null;
          streetLine1: string | null;
          streetLine2: string | null;
          city: string | null;
          province: string | null;
          postalCode: string | null;
          country: string | null;
          countryCode: string | null;
          phoneNumber: string | null;
        } | null;
        billingAddress: {
          fullName: string | null;
          company: string | null;
          streetLine1: string | null;
          streetLine2: string | null;
          city: string | null;
          province: string | null;
          postalCode: string | null;
          country: string | null;
          countryCode: string | null;
          phoneNumber: string | null;
        } | null;
        shippingLines: Array<{
          id: string;
          priceWithTax: number;
          shippingMethod: { id: string; code: string; name: string; description: string };
        }>;
        payments: Array<{
          id: string;
          method: string;
          amount: number;
          state: string;
          transactionId: string | null;
          errorMessage: string | null;
          metadata: unknown;
        }> | null;
        discounts: Array<{
          description: string;
          amount: number;
          amountWithTax: number;
          type: AdjustmentType;
        }>;
        lines: Array<{
          id: string;
          quantity: number;
          unitPriceWithTax: number;
          discountedUnitPriceWithTax: number;
          linePriceWithTax: number;
          discountedLinePriceWithTax: number;
          productVariant: {
            id: string;
            sku: string;
            name: string;
            price: number;
            priceWithTax: number;
            currencyCode: CurrencyCode;
            product: { id: string; name: string; slug: string };
            options: Array<{ id: string; code: string; name: string; groupId: string }>;
          };
          featuredAsset: {
            id: string;
            name: string;
            source: string;
            preview: string;
            width: number;
            height: number;
            mimeType: string;
            type: AssetType;
          } | null;
        }>;
      };
};

export type SetOrderBillingAddressMutationVariables = Exact<{
  input: CreateAddressInput;
}>;

export type SetOrderBillingAddressMutation = {
  setOrderBillingAddress:
    | { __typename: 'NoActiveOrderError'; errorCode: ErrorCode; message: string }
    | {
        __typename: 'Order';
        id: string;
        code: string;
        state: string;
        active: boolean;
        totalQuantity: number;
        currencyCode: CurrencyCode;
        subTotal: number;
        subTotalWithTax: number;
        shipping: number;
        shippingWithTax: number;
        total: number;
        totalWithTax: number;
        orderPlacedAt: string | null;
        couponCodes: Array<string>;
        customer: { id: string; firstName: string; lastName: string; emailAddress: string } | null;
        shippingAddress: {
          fullName: string | null;
          company: string | null;
          streetLine1: string | null;
          streetLine2: string | null;
          city: string | null;
          province: string | null;
          postalCode: string | null;
          country: string | null;
          countryCode: string | null;
          phoneNumber: string | null;
        } | null;
        billingAddress: {
          fullName: string | null;
          company: string | null;
          streetLine1: string | null;
          streetLine2: string | null;
          city: string | null;
          province: string | null;
          postalCode: string | null;
          country: string | null;
          countryCode: string | null;
          phoneNumber: string | null;
        } | null;
        shippingLines: Array<{
          id: string;
          priceWithTax: number;
          shippingMethod: { id: string; code: string; name: string; description: string };
        }>;
        payments: Array<{
          id: string;
          method: string;
          amount: number;
          state: string;
          transactionId: string | null;
          errorMessage: string | null;
          metadata: unknown;
        }> | null;
        discounts: Array<{
          description: string;
          amount: number;
          amountWithTax: number;
          type: AdjustmentType;
        }>;
        lines: Array<{
          id: string;
          quantity: number;
          unitPriceWithTax: number;
          discountedUnitPriceWithTax: number;
          linePriceWithTax: number;
          discountedLinePriceWithTax: number;
          productVariant: {
            id: string;
            sku: string;
            name: string;
            price: number;
            priceWithTax: number;
            currencyCode: CurrencyCode;
            product: { id: string; name: string; slug: string };
            options: Array<{ id: string; code: string; name: string; groupId: string }>;
          };
          featuredAsset: {
            id: string;
            name: string;
            source: string;
            preview: string;
            width: number;
            height: number;
            mimeType: string;
            type: AssetType;
          } | null;
        }>;
      };
};

export type SetOrderShippingMethodMutationVariables = Exact<{
  shippingMethodId: Array<string | number> | string | number;
}>;

export type SetOrderShippingMethodMutation = {
  setOrderShippingMethod:
    | { __typename: 'IneligibleShippingMethodError'; errorCode: ErrorCode; message: string }
    | { __typename: 'NoActiveOrderError'; errorCode: ErrorCode; message: string }
    | {
        __typename: 'Order';
        id: string;
        code: string;
        state: string;
        active: boolean;
        totalQuantity: number;
        currencyCode: CurrencyCode;
        subTotal: number;
        subTotalWithTax: number;
        shipping: number;
        shippingWithTax: number;
        total: number;
        totalWithTax: number;
        orderPlacedAt: string | null;
        couponCodes: Array<string>;
        customer: { id: string; firstName: string; lastName: string; emailAddress: string } | null;
        shippingAddress: {
          fullName: string | null;
          company: string | null;
          streetLine1: string | null;
          streetLine2: string | null;
          city: string | null;
          province: string | null;
          postalCode: string | null;
          country: string | null;
          countryCode: string | null;
          phoneNumber: string | null;
        } | null;
        billingAddress: {
          fullName: string | null;
          company: string | null;
          streetLine1: string | null;
          streetLine2: string | null;
          city: string | null;
          province: string | null;
          postalCode: string | null;
          country: string | null;
          countryCode: string | null;
          phoneNumber: string | null;
        } | null;
        shippingLines: Array<{
          id: string;
          priceWithTax: number;
          shippingMethod: { id: string; code: string; name: string; description: string };
        }>;
        payments: Array<{
          id: string;
          method: string;
          amount: number;
          state: string;
          transactionId: string | null;
          errorMessage: string | null;
          metadata: unknown;
        }> | null;
        discounts: Array<{
          description: string;
          amount: number;
          amountWithTax: number;
          type: AdjustmentType;
        }>;
        lines: Array<{
          id: string;
          quantity: number;
          unitPriceWithTax: number;
          discountedUnitPriceWithTax: number;
          linePriceWithTax: number;
          discountedLinePriceWithTax: number;
          productVariant: {
            id: string;
            sku: string;
            name: string;
            price: number;
            priceWithTax: number;
            currencyCode: CurrencyCode;
            product: { id: string; name: string; slug: string };
            options: Array<{ id: string; code: string; name: string; groupId: string }>;
          };
          featuredAsset: {
            id: string;
            name: string;
            source: string;
            preview: string;
            width: number;
            height: number;
            mimeType: string;
            type: AssetType;
          } | null;
        }>;
      }
    | { __typename: 'OrderModificationError'; errorCode: ErrorCode; message: string };
};

export type EligibleShippingMethodsQueryVariables = Exact<{ [key: string]: never }>;

export type EligibleShippingMethodsQuery = {
  eligibleShippingMethods: Array<{
    id: string;
    code: string;
    name: string;
    description: string;
    price: number;
    priceWithTax: number;
  }>;
};

export type EligiblePaymentMethodsQueryVariables = Exact<{ [key: string]: never }>;

export type EligiblePaymentMethodsQuery = {
  eligiblePaymentMethods: Array<{
    id: string;
    code: string;
    name: string;
    description: string;
    isEligible: boolean;
    eligibilityMessage: string | null;
  }>;
};

export type NextOrderStatesQueryVariables = Exact<{ [key: string]: never }>;

export type NextOrderStatesQuery = { nextOrderStates: Array<string> };

export type TransitionOrderToStateMutationVariables = Exact<{
  state: string;
}>;

export type TransitionOrderToStateMutation = {
  transitionOrderToState:
    | {
        __typename: 'Order';
        id: string;
        code: string;
        state: string;
        active: boolean;
        totalQuantity: number;
        currencyCode: CurrencyCode;
        subTotal: number;
        subTotalWithTax: number;
        shipping: number;
        shippingWithTax: number;
        total: number;
        totalWithTax: number;
        orderPlacedAt: string | null;
        couponCodes: Array<string>;
        customer: { id: string; firstName: string; lastName: string; emailAddress: string } | null;
        shippingAddress: {
          fullName: string | null;
          company: string | null;
          streetLine1: string | null;
          streetLine2: string | null;
          city: string | null;
          province: string | null;
          postalCode: string | null;
          country: string | null;
          countryCode: string | null;
          phoneNumber: string | null;
        } | null;
        billingAddress: {
          fullName: string | null;
          company: string | null;
          streetLine1: string | null;
          streetLine2: string | null;
          city: string | null;
          province: string | null;
          postalCode: string | null;
          country: string | null;
          countryCode: string | null;
          phoneNumber: string | null;
        } | null;
        shippingLines: Array<{
          id: string;
          priceWithTax: number;
          shippingMethod: { id: string; code: string; name: string; description: string };
        }>;
        payments: Array<{
          id: string;
          method: string;
          amount: number;
          state: string;
          transactionId: string | null;
          errorMessage: string | null;
          metadata: unknown;
        }> | null;
        discounts: Array<{
          description: string;
          amount: number;
          amountWithTax: number;
          type: AdjustmentType;
        }>;
        lines: Array<{
          id: string;
          quantity: number;
          unitPriceWithTax: number;
          discountedUnitPriceWithTax: number;
          linePriceWithTax: number;
          discountedLinePriceWithTax: number;
          productVariant: {
            id: string;
            sku: string;
            name: string;
            price: number;
            priceWithTax: number;
            currencyCode: CurrencyCode;
            product: { id: string; name: string; slug: string };
            options: Array<{ id: string; code: string; name: string; groupId: string }>;
          };
          featuredAsset: {
            id: string;
            name: string;
            source: string;
            preview: string;
            width: number;
            height: number;
            mimeType: string;
            type: AssetType;
          } | null;
        }>;
      }
    | { __typename: 'OrderStateTransitionError'; errorCode: ErrorCode; message: string }
    | null;
};

export type AddPaymentToOrderMutationVariables = Exact<{
  input: PaymentInput;
}>;

export type AddPaymentToOrderMutation = {
  addPaymentToOrder:
    | { __typename: 'IneligiblePaymentMethodError'; errorCode: ErrorCode; message: string }
    | { __typename: 'NoActiveOrderError'; errorCode: ErrorCode; message: string }
    | {
        __typename: 'Order';
        id: string;
        code: string;
        state: string;
        active: boolean;
        totalQuantity: number;
        currencyCode: CurrencyCode;
        subTotal: number;
        subTotalWithTax: number;
        shipping: number;
        shippingWithTax: number;
        total: number;
        totalWithTax: number;
        orderPlacedAt: string | null;
        couponCodes: Array<string>;
        customer: { id: string; firstName: string; lastName: string; emailAddress: string } | null;
        shippingAddress: {
          fullName: string | null;
          company: string | null;
          streetLine1: string | null;
          streetLine2: string | null;
          city: string | null;
          province: string | null;
          postalCode: string | null;
          country: string | null;
          countryCode: string | null;
          phoneNumber: string | null;
        } | null;
        billingAddress: {
          fullName: string | null;
          company: string | null;
          streetLine1: string | null;
          streetLine2: string | null;
          city: string | null;
          province: string | null;
          postalCode: string | null;
          country: string | null;
          countryCode: string | null;
          phoneNumber: string | null;
        } | null;
        shippingLines: Array<{
          id: string;
          priceWithTax: number;
          shippingMethod: { id: string; code: string; name: string; description: string };
        }>;
        payments: Array<{
          id: string;
          method: string;
          amount: number;
          state: string;
          transactionId: string | null;
          errorMessage: string | null;
          metadata: unknown;
        }> | null;
        discounts: Array<{
          description: string;
          amount: number;
          amountWithTax: number;
          type: AdjustmentType;
        }>;
        lines: Array<{
          id: string;
          quantity: number;
          unitPriceWithTax: number;
          discountedUnitPriceWithTax: number;
          linePriceWithTax: number;
          discountedLinePriceWithTax: number;
          productVariant: {
            id: string;
            sku: string;
            name: string;
            price: number;
            priceWithTax: number;
            currencyCode: CurrencyCode;
            product: { id: string; name: string; slug: string };
            options: Array<{ id: string; code: string; name: string; groupId: string }>;
          };
          featuredAsset: {
            id: string;
            name: string;
            source: string;
            preview: string;
            width: number;
            height: number;
            mimeType: string;
            type: AssetType;
          } | null;
        }>;
      }
    | { __typename: 'OrderPaymentStateError'; errorCode: ErrorCode; message: string }
    | { __typename: 'OrderStateTransitionError'; errorCode: ErrorCode; message: string }
    | { __typename: 'PaymentDeclinedError'; errorCode: ErrorCode; message: string }
    | { __typename: 'PaymentFailedError'; errorCode: ErrorCode; message: string };
};

export type CollectionSummaryFieldsFragment = {
  id: string;
  name: string;
  slug: string;
  position: number;
  parentId: string;
  featuredAsset: {
    id: string;
    name: string;
    source: string;
    preview: string;
    width: number;
    height: number;
    mimeType: string;
    type: AssetType;
  } | null;
  breadcrumbs: Array<{ id: string; name: string; slug: string }>;
};

export type CollectionDetailFieldsFragment = {
  description: string;
  productVariantCount: number;
  id: string;
  name: string;
  slug: string;
  position: number;
  parentId: string;
  children: Array<{
    id: string;
    name: string;
    slug: string;
    position: number;
    parentId: string;
    featuredAsset: {
      id: string;
      name: string;
      source: string;
      preview: string;
      width: number;
      height: number;
      mimeType: string;
      type: AssetType;
    } | null;
    breadcrumbs: Array<{ id: string; name: string; slug: string }>;
  }> | null;
  featuredAsset: {
    id: string;
    name: string;
    source: string;
    preview: string;
    width: number;
    height: number;
    mimeType: string;
    type: AssetType;
  } | null;
  breadcrumbs: Array<{ id: string; name: string; slug: string }>;
};

export type CollectionListQueryVariables = Exact<{
  options?: CollectionListOptions | null | undefined;
}>;

export type CollectionListQuery = {
  collections: {
    totalItems: number;
    items: Array<{
      id: string;
      name: string;
      slug: string;
      position: number;
      parentId: string;
      featuredAsset: {
        id: string;
        name: string;
        source: string;
        preview: string;
        width: number;
        height: number;
        mimeType: string;
        type: AssetType;
      } | null;
      breadcrumbs: Array<{ id: string; name: string; slug: string }>;
    }>;
  };
};

export type CollectionBySlugQueryVariables = Exact<{
  slug: string;
}>;

export type CollectionBySlugQuery = {
  collection: {
    description: string;
    productVariantCount: number;
    id: string;
    name: string;
    slug: string;
    position: number;
    parentId: string;
    children: Array<{
      id: string;
      name: string;
      slug: string;
      position: number;
      parentId: string;
      featuredAsset: {
        id: string;
        name: string;
        source: string;
        preview: string;
        width: number;
        height: number;
        mimeType: string;
        type: AssetType;
      } | null;
      breadcrumbs: Array<{ id: string; name: string; slug: string }>;
    }> | null;
    featuredAsset: {
      id: string;
      name: string;
      source: string;
      preview: string;
      width: number;
      height: number;
      mimeType: string;
      type: AssetType;
    } | null;
    breadcrumbs: Array<{ id: string; name: string; slug: string }>;
  } | null;
};

export type CollectionTreeNavQueryVariables = Exact<{ [key: string]: never }>;

export type CollectionTreeNavQuery = {
  collections: {
    items: Array<{
      id: string;
      name: string;
      slug: string;
      position: number;
      parentId: string;
      children: Array<{
        id: string;
        name: string;
        slug: string;
        position: number;
        parentId: string;
        featuredAsset: {
          id: string;
          name: string;
          source: string;
          preview: string;
          width: number;
          height: number;
          mimeType: string;
          type: AssetType;
        } | null;
        breadcrumbs: Array<{ id: string; name: string; slug: string }>;
      }> | null;
      featuredAsset: {
        id: string;
        name: string;
        source: string;
        preview: string;
        width: number;
        height: number;
        mimeType: string;
        type: AssetType;
      } | null;
      breadcrumbs: Array<{ id: string; name: string; slug: string }>;
    }>;
  };
};

type ErrorFields_AlreadyLoggedInError_Fragment = { errorCode: ErrorCode; message: string };

type ErrorFields_CouponCodeExpiredError_Fragment = { errorCode: ErrorCode; message: string };

type ErrorFields_CouponCodeInvalidError_Fragment = { errorCode: ErrorCode; message: string };

type ErrorFields_CouponCodeLimitError_Fragment = { errorCode: ErrorCode; message: string };

type ErrorFields_EmailAddressConflictError_Fragment = { errorCode: ErrorCode; message: string };

type ErrorFields_GuestCheckoutError_Fragment = { errorCode: ErrorCode; message: string };

type ErrorFields_IdentifierChangeTokenExpiredError_Fragment = {
  errorCode: ErrorCode;
  message: string;
};

type ErrorFields_IdentifierChangeTokenInvalidError_Fragment = {
  errorCode: ErrorCode;
  message: string;
};

type ErrorFields_IneligiblePaymentMethodError_Fragment = { errorCode: ErrorCode; message: string };

type ErrorFields_IneligibleShippingMethodError_Fragment = { errorCode: ErrorCode; message: string };

type ErrorFields_InsufficientStockError_Fragment = { errorCode: ErrorCode; message: string };

type ErrorFields_InvalidCredentialsError_Fragment = { errorCode: ErrorCode; message: string };

type ErrorFields_MissingPasswordError_Fragment = { errorCode: ErrorCode; message: string };

type ErrorFields_MolliePaymentIntentError_Fragment = { errorCode: ErrorCode; message: string };

type ErrorFields_NativeAuthStrategyError_Fragment = { errorCode: ErrorCode; message: string };

type ErrorFields_NegativeQuantityError_Fragment = { errorCode: ErrorCode; message: string };

type ErrorFields_NoActiveOrderError_Fragment = { errorCode: ErrorCode; message: string };

type ErrorFields_NotVerifiedError_Fragment = { errorCode: ErrorCode; message: string };

type ErrorFields_OrderInterceptorError_Fragment = { errorCode: ErrorCode; message: string };

type ErrorFields_OrderLimitError_Fragment = { errorCode: ErrorCode; message: string };

type ErrorFields_OrderModificationError_Fragment = { errorCode: ErrorCode; message: string };

type ErrorFields_OrderPaymentStateError_Fragment = { errorCode: ErrorCode; message: string };

type ErrorFields_OrderStateTransitionError_Fragment = { errorCode: ErrorCode; message: string };

type ErrorFields_PasswordAlreadySetError_Fragment = { errorCode: ErrorCode; message: string };

type ErrorFields_PasswordResetTokenExpiredError_Fragment = {
  errorCode: ErrorCode;
  message: string;
};

type ErrorFields_PasswordResetTokenInvalidError_Fragment = {
  errorCode: ErrorCode;
  message: string;
};

type ErrorFields_PasswordValidationError_Fragment = { errorCode: ErrorCode; message: string };

type ErrorFields_PaymentDeclinedError_Fragment = { errorCode: ErrorCode; message: string };

type ErrorFields_PaymentFailedError_Fragment = { errorCode: ErrorCode; message: string };

type ErrorFields_VerificationTokenExpiredError_Fragment = { errorCode: ErrorCode; message: string };

type ErrorFields_VerificationTokenInvalidError_Fragment = { errorCode: ErrorCode; message: string };

export type ErrorFieldsFragment =
  | ErrorFields_AlreadyLoggedInError_Fragment
  | ErrorFields_CouponCodeExpiredError_Fragment
  | ErrorFields_CouponCodeInvalidError_Fragment
  | ErrorFields_CouponCodeLimitError_Fragment
  | ErrorFields_EmailAddressConflictError_Fragment
  | ErrorFields_GuestCheckoutError_Fragment
  | ErrorFields_IdentifierChangeTokenExpiredError_Fragment
  | ErrorFields_IdentifierChangeTokenInvalidError_Fragment
  | ErrorFields_IneligiblePaymentMethodError_Fragment
  | ErrorFields_IneligibleShippingMethodError_Fragment
  | ErrorFields_InsufficientStockError_Fragment
  | ErrorFields_InvalidCredentialsError_Fragment
  | ErrorFields_MissingPasswordError_Fragment
  | ErrorFields_MolliePaymentIntentError_Fragment
  | ErrorFields_NativeAuthStrategyError_Fragment
  | ErrorFields_NegativeQuantityError_Fragment
  | ErrorFields_NoActiveOrderError_Fragment
  | ErrorFields_NotVerifiedError_Fragment
  | ErrorFields_OrderInterceptorError_Fragment
  | ErrorFields_OrderLimitError_Fragment
  | ErrorFields_OrderModificationError_Fragment
  | ErrorFields_OrderPaymentStateError_Fragment
  | ErrorFields_OrderStateTransitionError_Fragment
  | ErrorFields_PasswordAlreadySetError_Fragment
  | ErrorFields_PasswordResetTokenExpiredError_Fragment
  | ErrorFields_PasswordResetTokenInvalidError_Fragment
  | ErrorFields_PasswordValidationError_Fragment
  | ErrorFields_PaymentDeclinedError_Fragment
  | ErrorFields_PaymentFailedError_Fragment
  | ErrorFields_VerificationTokenExpiredError_Fragment
  | ErrorFields_VerificationTokenInvalidError_Fragment;

export type CustomerCustomFieldsFragmentFragment = {
  marketingOptIn: boolean | null;
  marketingOptInAt: string | null;
  preferredActivity: string | null;
};

export type AddressFieldsFragment = {
  id: string;
  fullName: string | null;
  company: string | null;
  streetLine1: string;
  streetLine2: string | null;
  city: string | null;
  province: string | null;
  postalCode: string | null;
  phoneNumber: string | null;
  defaultShippingAddress: boolean | null;
  defaultBillingAddress: boolean | null;
  country: { id: string; code: string; name: string };
};

export type CustomerFieldsFragment = {
  id: string;
  title: string | null;
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string | null;
  addresses: Array<{
    id: string;
    fullName: string | null;
    company: string | null;
    streetLine1: string;
    streetLine2: string | null;
    city: string | null;
    province: string | null;
    postalCode: string | null;
    phoneNumber: string | null;
    defaultShippingAddress: boolean | null;
    defaultBillingAddress: boolean | null;
    country: { id: string; code: string; name: string };
  }> | null;
  customFields: {
    marketingOptIn: boolean | null;
    marketingOptInAt: string | null;
    preferredActivity: string | null;
  } | null;
};

export type CurrentUserFieldsFragment = {
  id: string;
  identifier: string;
  channels: Array<{ id: string; token: string; code: string; permissions: Array<Permission> }>;
};

export type ActiveCustomerQueryVariables = Exact<{ [key: string]: never }>;

export type ActiveCustomerQuery = {
  activeCustomer: {
    id: string;
    title: string | null;
    firstName: string;
    lastName: string;
    emailAddress: string;
    phoneNumber: string | null;
    addresses: Array<{
      id: string;
      fullName: string | null;
      company: string | null;
      streetLine1: string;
      streetLine2: string | null;
      city: string | null;
      province: string | null;
      postalCode: string | null;
      phoneNumber: string | null;
      defaultShippingAddress: boolean | null;
      defaultBillingAddress: boolean | null;
      country: { id: string; code: string; name: string };
    }> | null;
    customFields: {
      marketingOptIn: boolean | null;
      marketingOptInAt: string | null;
      preferredActivity: string | null;
    } | null;
  } | null;
};

export type LoginMutationVariables = Exact<{
  username: string;
  password: string;
  rememberMe?: boolean | null | undefined;
}>;

export type LoginMutation = {
  login:
    | {
        __typename: 'CurrentUser';
        id: string;
        identifier: string;
        channels: Array<{
          id: string;
          token: string;
          code: string;
          permissions: Array<Permission>;
        }>;
      }
    | { __typename: 'InvalidCredentialsError'; errorCode: ErrorCode; message: string }
    | { __typename: 'NativeAuthStrategyError'; errorCode: ErrorCode; message: string }
    | { __typename: 'NotVerifiedError'; errorCode: ErrorCode; message: string };
};

export type LogoutMutationVariables = Exact<{ [key: string]: never }>;

export type LogoutMutation = { logout: { success: boolean } };

export type RegisterCustomerAccountMutationVariables = Exact<{
  input: RegisterCustomerInput;
}>;

export type RegisterCustomerAccountMutation = {
  registerCustomerAccount:
    | { __typename: 'MissingPasswordError'; errorCode: ErrorCode; message: string }
    | { __typename: 'NativeAuthStrategyError'; errorCode: ErrorCode; message: string }
    | { __typename: 'PasswordValidationError'; errorCode: ErrorCode; message: string }
    | { __typename: 'Success'; success: boolean };
};

export type VerifyCustomerAccountMutationVariables = Exact<{
  token: string;
  password?: string | null | undefined;
}>;

export type VerifyCustomerAccountMutation = {
  verifyCustomerAccount:
    | {
        __typename: 'CurrentUser';
        id: string;
        identifier: string;
        channels: Array<{
          id: string;
          token: string;
          code: string;
          permissions: Array<Permission>;
        }>;
      }
    | { __typename: 'MissingPasswordError'; errorCode: ErrorCode; message: string }
    | { __typename: 'NativeAuthStrategyError'; errorCode: ErrorCode; message: string }
    | { __typename: 'PasswordAlreadySetError'; errorCode: ErrorCode; message: string }
    | { __typename: 'PasswordValidationError'; errorCode: ErrorCode; message: string }
    | { __typename: 'VerificationTokenExpiredError'; errorCode: ErrorCode; message: string }
    | { __typename: 'VerificationTokenInvalidError'; errorCode: ErrorCode; message: string };
};

export type RequestPasswordResetMutationVariables = Exact<{
  emailAddress: string;
}>;

export type RequestPasswordResetMutation = {
  requestPasswordReset:
    | { __typename: 'NativeAuthStrategyError'; errorCode: ErrorCode; message: string }
    | { __typename: 'Success'; success: boolean }
    | null;
};

export type ResetPasswordMutationVariables = Exact<{
  token: string;
  password: string;
}>;

export type ResetPasswordMutation = {
  resetPassword:
    | {
        __typename: 'CurrentUser';
        id: string;
        identifier: string;
        channels: Array<{
          id: string;
          token: string;
          code: string;
          permissions: Array<Permission>;
        }>;
      }
    | { __typename: 'NativeAuthStrategyError'; errorCode: ErrorCode; message: string }
    | { __typename: 'NotVerifiedError'; errorCode: ErrorCode; message: string }
    | { __typename: 'PasswordResetTokenExpiredError'; errorCode: ErrorCode; message: string }
    | { __typename: 'PasswordResetTokenInvalidError'; errorCode: ErrorCode; message: string }
    | { __typename: 'PasswordValidationError'; errorCode: ErrorCode; message: string };
};

export type UpdateCustomerMutationVariables = Exact<{
  input: UpdateCustomerInput;
}>;

export type UpdateCustomerMutation = {
  updateCustomer: {
    id: string;
    title: string | null;
    firstName: string;
    lastName: string;
    emailAddress: string;
    phoneNumber: string | null;
    addresses: Array<{
      id: string;
      fullName: string | null;
      company: string | null;
      streetLine1: string;
      streetLine2: string | null;
      city: string | null;
      province: string | null;
      postalCode: string | null;
      phoneNumber: string | null;
      defaultShippingAddress: boolean | null;
      defaultBillingAddress: boolean | null;
      country: { id: string; code: string; name: string };
    }> | null;
    customFields: {
      marketingOptIn: boolean | null;
      marketingOptInAt: string | null;
      preferredActivity: string | null;
    } | null;
  };
};

export type UpdateCustomerPasswordMutationVariables = Exact<{
  currentPassword: string;
  newPassword: string;
}>;

export type UpdateCustomerPasswordMutation = {
  updateCustomerPassword:
    | { __typename: 'InvalidCredentialsError'; errorCode: ErrorCode; message: string }
    | { __typename: 'NativeAuthStrategyError'; errorCode: ErrorCode; message: string }
    | { __typename: 'PasswordValidationError'; errorCode: ErrorCode; message: string }
    | { __typename: 'Success'; success: boolean };
};

export type RequestUpdateCustomerEmailAddressMutationVariables = Exact<{
  password: string;
  newEmailAddress: string;
}>;

export type RequestUpdateCustomerEmailAddressMutation = {
  requestUpdateCustomerEmailAddress:
    | { __typename: 'EmailAddressConflictError'; errorCode: ErrorCode; message: string }
    | { __typename: 'InvalidCredentialsError'; errorCode: ErrorCode; message: string }
    | { __typename: 'NativeAuthStrategyError'; errorCode: ErrorCode; message: string }
    | { __typename: 'Success'; success: boolean };
};

export type UpdateCustomerEmailAddressMutationVariables = Exact<{
  token: string;
}>;

export type UpdateCustomerEmailAddressMutation = {
  updateCustomerEmailAddress:
    | { __typename: 'IdentifierChangeTokenExpiredError'; errorCode: ErrorCode; message: string }
    | { __typename: 'IdentifierChangeTokenInvalidError'; errorCode: ErrorCode; message: string }
    | { __typename: 'NativeAuthStrategyError'; errorCode: ErrorCode; message: string }
    | { __typename: 'Success'; success: boolean };
};

export type OrderAddressFieldsFragment = {
  fullName: string | null;
  company: string | null;
  streetLine1: string | null;
  streetLine2: string | null;
  city: string | null;
  province: string | null;
  postalCode: string | null;
  country: string | null;
  countryCode: string | null;
  phoneNumber: string | null;
};

export type OrderLineFieldsFragment = {
  id: string;
  quantity: number;
  unitPriceWithTax: number;
  discountedUnitPriceWithTax: number;
  linePriceWithTax: number;
  discountedLinePriceWithTax: number;
  productVariant: {
    id: string;
    sku: string;
    name: string;
    price: number;
    priceWithTax: number;
    currencyCode: CurrencyCode;
    product: { id: string; name: string; slug: string };
    options: Array<{ id: string; code: string; name: string; groupId: string }>;
  };
  featuredAsset: {
    id: string;
    name: string;
    source: string;
    preview: string;
    width: number;
    height: number;
    mimeType: string;
    type: AssetType;
  } | null;
};

export type OrderSummaryFieldsFragment = {
  id: string;
  code: string;
  state: string;
  active: boolean;
  totalQuantity: number;
  currencyCode: CurrencyCode;
  subTotal: number;
  subTotalWithTax: number;
  shipping: number;
  shippingWithTax: number;
  total: number;
  totalWithTax: number;
  orderPlacedAt: string | null;
  couponCodes: Array<string>;
  lines: Array<{
    id: string;
    quantity: number;
    unitPriceWithTax: number;
    discountedUnitPriceWithTax: number;
    linePriceWithTax: number;
    discountedLinePriceWithTax: number;
    productVariant: {
      id: string;
      sku: string;
      name: string;
      price: number;
      priceWithTax: number;
      currencyCode: CurrencyCode;
      product: { id: string; name: string; slug: string };
      options: Array<{ id: string; code: string; name: string; groupId: string }>;
    };
    featuredAsset: {
      id: string;
      name: string;
      source: string;
      preview: string;
      width: number;
      height: number;
      mimeType: string;
      type: AssetType;
    } | null;
  }>;
};

export type OrderDetailFieldsFragment = {
  id: string;
  code: string;
  state: string;
  active: boolean;
  totalQuantity: number;
  currencyCode: CurrencyCode;
  subTotal: number;
  subTotalWithTax: number;
  shipping: number;
  shippingWithTax: number;
  total: number;
  totalWithTax: number;
  orderPlacedAt: string | null;
  couponCodes: Array<string>;
  customer: { id: string; firstName: string; lastName: string; emailAddress: string } | null;
  shippingAddress: {
    fullName: string | null;
    company: string | null;
    streetLine1: string | null;
    streetLine2: string | null;
    city: string | null;
    province: string | null;
    postalCode: string | null;
    country: string | null;
    countryCode: string | null;
    phoneNumber: string | null;
  } | null;
  billingAddress: {
    fullName: string | null;
    company: string | null;
    streetLine1: string | null;
    streetLine2: string | null;
    city: string | null;
    province: string | null;
    postalCode: string | null;
    country: string | null;
    countryCode: string | null;
    phoneNumber: string | null;
  } | null;
  shippingLines: Array<{
    id: string;
    priceWithTax: number;
    shippingMethod: { id: string; code: string; name: string; description: string };
  }>;
  payments: Array<{
    id: string;
    method: string;
    amount: number;
    state: string;
    transactionId: string | null;
    errorMessage: string | null;
    metadata: unknown;
  }> | null;
  discounts: Array<{
    description: string;
    amount: number;
    amountWithTax: number;
    type: AdjustmentType;
  }>;
  lines: Array<{
    id: string;
    quantity: number;
    unitPriceWithTax: number;
    discountedUnitPriceWithTax: number;
    linePriceWithTax: number;
    discountedLinePriceWithTax: number;
    productVariant: {
      id: string;
      sku: string;
      name: string;
      price: number;
      priceWithTax: number;
      currencyCode: CurrencyCode;
      product: { id: string; name: string; slug: string };
      options: Array<{ id: string; code: string; name: string; groupId: string }>;
    };
    featuredAsset: {
      id: string;
      name: string;
      source: string;
      preview: string;
      width: number;
      height: number;
      mimeType: string;
      type: AssetType;
    } | null;
  }>;
};

export type ActiveOrderQueryVariables = Exact<{ [key: string]: never }>;

export type ActiveOrderQuery = {
  activeOrder: {
    id: string;
    code: string;
    state: string;
    active: boolean;
    totalQuantity: number;
    currencyCode: CurrencyCode;
    subTotal: number;
    subTotalWithTax: number;
    shipping: number;
    shippingWithTax: number;
    total: number;
    totalWithTax: number;
    orderPlacedAt: string | null;
    couponCodes: Array<string>;
    customer: { id: string; firstName: string; lastName: string; emailAddress: string } | null;
    shippingAddress: {
      fullName: string | null;
      company: string | null;
      streetLine1: string | null;
      streetLine2: string | null;
      city: string | null;
      province: string | null;
      postalCode: string | null;
      country: string | null;
      countryCode: string | null;
      phoneNumber: string | null;
    } | null;
    billingAddress: {
      fullName: string | null;
      company: string | null;
      streetLine1: string | null;
      streetLine2: string | null;
      city: string | null;
      province: string | null;
      postalCode: string | null;
      country: string | null;
      countryCode: string | null;
      phoneNumber: string | null;
    } | null;
    shippingLines: Array<{
      id: string;
      priceWithTax: number;
      shippingMethod: { id: string; code: string; name: string; description: string };
    }>;
    payments: Array<{
      id: string;
      method: string;
      amount: number;
      state: string;
      transactionId: string | null;
      errorMessage: string | null;
      metadata: unknown;
    }> | null;
    discounts: Array<{
      description: string;
      amount: number;
      amountWithTax: number;
      type: AdjustmentType;
    }>;
    lines: Array<{
      id: string;
      quantity: number;
      unitPriceWithTax: number;
      discountedUnitPriceWithTax: number;
      linePriceWithTax: number;
      discountedLinePriceWithTax: number;
      productVariant: {
        id: string;
        sku: string;
        name: string;
        price: number;
        priceWithTax: number;
        currencyCode: CurrencyCode;
        product: { id: string; name: string; slug: string };
        options: Array<{ id: string; code: string; name: string; groupId: string }>;
      };
      featuredAsset: {
        id: string;
        name: string;
        source: string;
        preview: string;
        width: number;
        height: number;
        mimeType: string;
        type: AssetType;
      } | null;
    }>;
  } | null;
};

export type ActiveCustomerOrdersQueryVariables = Exact<{
  options?: OrderListOptions | null | undefined;
}>;

export type ActiveCustomerOrdersQuery = {
  activeCustomer: {
    id: string;
    orders: {
      totalItems: number;
      items: Array<{
        id: string;
        code: string;
        state: string;
        active: boolean;
        totalQuantity: number;
        currencyCode: CurrencyCode;
        subTotal: number;
        subTotalWithTax: number;
        shipping: number;
        shippingWithTax: number;
        total: number;
        totalWithTax: number;
        orderPlacedAt: string | null;
        couponCodes: Array<string>;
        lines: Array<{
          id: string;
          quantity: number;
          unitPriceWithTax: number;
          discountedUnitPriceWithTax: number;
          linePriceWithTax: number;
          discountedLinePriceWithTax: number;
          productVariant: {
            id: string;
            sku: string;
            name: string;
            price: number;
            priceWithTax: number;
            currencyCode: CurrencyCode;
            product: { id: string; name: string; slug: string };
            options: Array<{ id: string; code: string; name: string; groupId: string }>;
          };
          featuredAsset: {
            id: string;
            name: string;
            source: string;
            preview: string;
            width: number;
            height: number;
            mimeType: string;
            type: AssetType;
          } | null;
        }>;
      }>;
    };
  } | null;
};

export type OrderByCodeQueryVariables = Exact<{
  code: string;
}>;

export type OrderByCodeQuery = {
  orderByCode: {
    id: string;
    code: string;
    state: string;
    active: boolean;
    totalQuantity: number;
    currencyCode: CurrencyCode;
    subTotal: number;
    subTotalWithTax: number;
    shipping: number;
    shippingWithTax: number;
    total: number;
    totalWithTax: number;
    orderPlacedAt: string | null;
    couponCodes: Array<string>;
    customer: { id: string; firstName: string; lastName: string; emailAddress: string } | null;
    shippingAddress: {
      fullName: string | null;
      company: string | null;
      streetLine1: string | null;
      streetLine2: string | null;
      city: string | null;
      province: string | null;
      postalCode: string | null;
      country: string | null;
      countryCode: string | null;
      phoneNumber: string | null;
    } | null;
    billingAddress: {
      fullName: string | null;
      company: string | null;
      streetLine1: string | null;
      streetLine2: string | null;
      city: string | null;
      province: string | null;
      postalCode: string | null;
      country: string | null;
      countryCode: string | null;
      phoneNumber: string | null;
    } | null;
    shippingLines: Array<{
      id: string;
      priceWithTax: number;
      shippingMethod: { id: string; code: string; name: string; description: string };
    }>;
    payments: Array<{
      id: string;
      method: string;
      amount: number;
      state: string;
      transactionId: string | null;
      errorMessage: string | null;
      metadata: unknown;
    }> | null;
    discounts: Array<{
      description: string;
      amount: number;
      amountWithTax: number;
      type: AdjustmentType;
    }>;
    lines: Array<{
      id: string;
      quantity: number;
      unitPriceWithTax: number;
      discountedUnitPriceWithTax: number;
      linePriceWithTax: number;
      discountedLinePriceWithTax: number;
      productVariant: {
        id: string;
        sku: string;
        name: string;
        price: number;
        priceWithTax: number;
        currencyCode: CurrencyCode;
        product: { id: string; name: string; slug: string };
        options: Array<{ id: string; code: string; name: string; groupId: string }>;
      };
      featuredAsset: {
        id: string;
        name: string;
        source: string;
        preview: string;
        width: number;
        height: number;
        mimeType: string;
        type: AssetType;
      } | null;
    }>;
  } | null;
};

export type ProductCustomFieldsFragmentFragment = {
  activity: Array<string> | null;
  materialComposition: string | null;
  careInstructions: string | null;
  sustainabilityNotes: string | null;
  manufacturerInfo: string | null;
  warnings: string | null;
  traceabilityCode: string | null;
  responsiblePerson: { id: string; name: string; email: string; address: string } | null;
};

export type AssetFieldsFragment = {
  id: string;
  name: string;
  source: string;
  preview: string;
  width: number;
  height: number;
  mimeType: string;
  type: AssetType;
};

export type ProductCardFieldsFragment = {
  id: string;
  name: string;
  slug: string;
  description: string;
  featuredAsset: {
    id: string;
    name: string;
    source: string;
    preview: string;
    width: number;
    height: number;
    mimeType: string;
    type: AssetType;
  } | null;
  variantList: {
    items: Array<{
      id: string;
      sku: string;
      price: number;
      priceWithTax: number;
      currencyCode: CurrencyCode;
    }>;
  };
  customFields: { activity: Array<string> | null } | null;
};

export type ProductDetailVariantFieldsFragment = {
  id: string;
  sku: string;
  name: string;
  price: number;
  priceWithTax: number;
  currencyCode: CurrencyCode;
  stockLevel: string;
  featuredAsset: {
    id: string;
    name: string;
    source: string;
    preview: string;
    width: number;
    height: number;
    mimeType: string;
    type: AssetType;
  } | null;
  assets: Array<{
    id: string;
    name: string;
    source: string;
    preview: string;
    width: number;
    height: number;
    mimeType: string;
    type: AssetType;
  }>;
  options: Array<{ id: string; code: string; name: string; groupId: string }>;
};

export type ProductDetailFieldsFragment = {
  id: string;
  name: string;
  slug: string;
  description: string;
  featuredAsset: {
    id: string;
    name: string;
    source: string;
    preview: string;
    width: number;
    height: number;
    mimeType: string;
    type: AssetType;
  } | null;
  assets: Array<{
    id: string;
    name: string;
    source: string;
    preview: string;
    width: number;
    height: number;
    mimeType: string;
    type: AssetType;
  }>;
  collections: Array<{
    id: string;
    name: string;
    slug: string;
    breadcrumbs: Array<{ id: string; name: string; slug: string }>;
  }>;
  optionGroups: Array<{
    id: string;
    code: string;
    name: string;
    options: Array<{ id: string; code: string; name: string }>;
  }>;
  variants: Array<{
    id: string;
    sku: string;
    name: string;
    price: number;
    priceWithTax: number;
    currencyCode: CurrencyCode;
    stockLevel: string;
    featuredAsset: {
      id: string;
      name: string;
      source: string;
      preview: string;
      width: number;
      height: number;
      mimeType: string;
      type: AssetType;
    } | null;
    assets: Array<{
      id: string;
      name: string;
      source: string;
      preview: string;
      width: number;
      height: number;
      mimeType: string;
      type: AssetType;
    }>;
    options: Array<{ id: string; code: string; name: string; groupId: string }>;
  }>;
  customFields: {
    activity: Array<string> | null;
    materialComposition: string | null;
    careInstructions: string | null;
    sustainabilityNotes: string | null;
    manufacturerInfo: string | null;
    warnings: string | null;
    traceabilityCode: string | null;
    responsiblePerson: { id: string; name: string; email: string; address: string } | null;
  } | null;
};

export type ProductListQueryVariables = Exact<{
  options?: ProductListOptions | null | undefined;
}>;

export type ProductListQuery = {
  products: {
    totalItems: number;
    items: Array<{
      id: string;
      name: string;
      slug: string;
      description: string;
      featuredAsset: {
        id: string;
        name: string;
        source: string;
        preview: string;
        width: number;
        height: number;
        mimeType: string;
        type: AssetType;
      } | null;
      variantList: {
        items: Array<{
          id: string;
          sku: string;
          price: number;
          priceWithTax: number;
          currencyCode: CurrencyCode;
        }>;
      };
      customFields: { activity: Array<string> | null } | null;
    }>;
  };
};

export type ProductBySlugQueryVariables = Exact<{
  slug: string;
}>;

export type ProductBySlugQuery = {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    featuredAsset: {
      id: string;
      name: string;
      source: string;
      preview: string;
      width: number;
      height: number;
      mimeType: string;
      type: AssetType;
    } | null;
    assets: Array<{
      id: string;
      name: string;
      source: string;
      preview: string;
      width: number;
      height: number;
      mimeType: string;
      type: AssetType;
    }>;
    collections: Array<{
      id: string;
      name: string;
      slug: string;
      breadcrumbs: Array<{ id: string; name: string; slug: string }>;
    }>;
    optionGroups: Array<{
      id: string;
      code: string;
      name: string;
      options: Array<{ id: string; code: string; name: string }>;
    }>;
    variants: Array<{
      id: string;
      sku: string;
      name: string;
      price: number;
      priceWithTax: number;
      currencyCode: CurrencyCode;
      stockLevel: string;
      featuredAsset: {
        id: string;
        name: string;
        source: string;
        preview: string;
        width: number;
        height: number;
        mimeType: string;
        type: AssetType;
      } | null;
      assets: Array<{
        id: string;
        name: string;
        source: string;
        preview: string;
        width: number;
        height: number;
        mimeType: string;
        type: AssetType;
      }>;
      options: Array<{ id: string; code: string; name: string; groupId: string }>;
    }>;
    customFields: {
      activity: Array<string> | null;
      materialComposition: string | null;
      careInstructions: string | null;
      sustainabilityNotes: string | null;
      manufacturerInfo: string | null;
      warnings: string | null;
      traceabilityCode: string | null;
      responsiblePerson: { id: string; name: string; email: string; address: string } | null;
    } | null;
  } | null;
};

export type SearchResultFieldsFragment = {
  productId: string;
  productName: string;
  slug: string;
  description: string;
  currencyCode: CurrencyCode;
  collectionIds: Array<string>;
  facetValueIds: Array<string>;
  productAsset: { id: string; preview: string; focalPoint: { x: number; y: number } | null } | null;
  priceWithTax:
    | { __typename: 'PriceRange'; min: number; max: number }
    | { __typename: 'SinglePrice'; value: number };
};

export type SearchFacetValueResultFieldsFragment = {
  count: number;
  facetValue: {
    id: string;
    code: string;
    name: string;
    facet: { id: string; code: string; name: string };
  };
};

export type SearchProductsQueryVariables = Exact<{
  input: SearchInput;
}>;

export type SearchProductsQuery = {
  search: {
    totalItems: number;
    items: Array<{
      productId: string;
      productName: string;
      slug: string;
      description: string;
      currencyCode: CurrencyCode;
      collectionIds: Array<string>;
      facetValueIds: Array<string>;
      productAsset: {
        id: string;
        preview: string;
        focalPoint: { x: number; y: number } | null;
      } | null;
      priceWithTax:
        | { __typename: 'PriceRange'; min: number; max: number }
        | { __typename: 'SinglePrice'; value: number };
    }>;
    facetValues: Array<{
      count: number;
      facetValue: {
        id: string;
        code: string;
        name: string;
        facet: { id: string; code: string; name: string };
      };
    }>;
  };
};

export const ChannelFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ChannelFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Channel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'code' } },
          { kind: 'Field', name: { kind: 'Name', value: 'token' } },
          { kind: 'Field', name: { kind: 'Name', value: 'defaultLanguageCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'availableLanguageCodes' } },
          { kind: 'Field', name: { kind: 'Name', value: 'defaultCurrencyCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'availableCurrencyCodes' } },
          { kind: 'Field', name: { kind: 'Name', value: 'pricesIncludeTax' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'defaultTaxZone' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'defaultShippingZone' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ChannelFieldsFragment, unknown>;
export const CountryFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'CountryFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Country' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'code' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'enabled' } },
          { kind: 'Field', name: { kind: 'Name', value: 'languageCode' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CountryFieldsFragment, unknown>;
export const ShippingMethodQuoteFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ShippingMethodQuoteFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ShippingMethodQuote' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'code' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'price' } },
          { kind: 'Field', name: { kind: 'Name', value: 'priceWithTax' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ShippingMethodQuoteFieldsFragment, unknown>;
export const PaymentMethodQuoteFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'PaymentMethodQuoteFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'PaymentMethodQuote' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'code' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'isEligible' } },
          { kind: 'Field', name: { kind: 'Name', value: 'eligibilityMessage' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<PaymentMethodQuoteFieldsFragment, unknown>;
export const AssetFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'AssetFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Asset' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'source' } },
          { kind: 'Field', name: { kind: 'Name', value: 'preview' } },
          { kind: 'Field', name: { kind: 'Name', value: 'width' } },
          { kind: 'Field', name: { kind: 'Name', value: 'height' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mimeType' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<AssetFieldsFragment, unknown>;
export const CollectionSummaryFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'CollectionSummaryFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Collection' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          { kind: 'Field', name: { kind: 'Name', value: 'position' } },
          { kind: 'Field', name: { kind: 'Name', value: 'parentId' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'featuredAsset' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'AssetFields' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'breadcrumbs' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'AssetFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Asset' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'source' } },
          { kind: 'Field', name: { kind: 'Name', value: 'preview' } },
          { kind: 'Field', name: { kind: 'Name', value: 'width' } },
          { kind: 'Field', name: { kind: 'Name', value: 'height' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mimeType' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CollectionSummaryFieldsFragment, unknown>;
export const CollectionDetailFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'CollectionDetailFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Collection' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'FragmentSpread', name: { kind: 'Name', value: 'CollectionSummaryFields' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'productVariantCount' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'children' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'CollectionSummaryFields' },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'AssetFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Asset' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'source' } },
          { kind: 'Field', name: { kind: 'Name', value: 'preview' } },
          { kind: 'Field', name: { kind: 'Name', value: 'width' } },
          { kind: 'Field', name: { kind: 'Name', value: 'height' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mimeType' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'CollectionSummaryFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Collection' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          { kind: 'Field', name: { kind: 'Name', value: 'position' } },
          { kind: 'Field', name: { kind: 'Name', value: 'parentId' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'featuredAsset' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'AssetFields' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'breadcrumbs' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CollectionDetailFieldsFragment, unknown>;
export const ErrorFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ErrorFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ErrorResult' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'errorCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'message' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ErrorFieldsFragment, unknown>;
export const AddressFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'AddressFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Address' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'company' } },
          { kind: 'Field', name: { kind: 'Name', value: 'streetLine1' } },
          { kind: 'Field', name: { kind: 'Name', value: 'streetLine2' } },
          { kind: 'Field', name: { kind: 'Name', value: 'city' } },
          { kind: 'Field', name: { kind: 'Name', value: 'province' } },
          { kind: 'Field', name: { kind: 'Name', value: 'postalCode' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'country' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'phoneNumber' } },
          { kind: 'Field', name: { kind: 'Name', value: 'defaultShippingAddress' } },
          { kind: 'Field', name: { kind: 'Name', value: 'defaultBillingAddress' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<AddressFieldsFragment, unknown>;
export const CustomerCustomFieldsFragmentFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'CustomerCustomFieldsFragment' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'CustomerCustomFields' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'marketingOptIn' } },
          { kind: 'Field', name: { kind: 'Name', value: 'marketingOptInAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'preferredActivity' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CustomerCustomFieldsFragmentFragment, unknown>;
export const CustomerFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'CustomerFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Customer' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'title' } },
          { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'emailAddress' } },
          { kind: 'Field', name: { kind: 'Name', value: 'phoneNumber' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'addresses' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'AddressFields' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'customFields' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'CustomerCustomFieldsFragment' },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'AddressFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Address' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'company' } },
          { kind: 'Field', name: { kind: 'Name', value: 'streetLine1' } },
          { kind: 'Field', name: { kind: 'Name', value: 'streetLine2' } },
          { kind: 'Field', name: { kind: 'Name', value: 'city' } },
          { kind: 'Field', name: { kind: 'Name', value: 'province' } },
          { kind: 'Field', name: { kind: 'Name', value: 'postalCode' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'country' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'phoneNumber' } },
          { kind: 'Field', name: { kind: 'Name', value: 'defaultShippingAddress' } },
          { kind: 'Field', name: { kind: 'Name', value: 'defaultBillingAddress' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'CustomerCustomFieldsFragment' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'CustomerCustomFields' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'marketingOptIn' } },
          { kind: 'Field', name: { kind: 'Name', value: 'marketingOptInAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'preferredActivity' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CustomerFieldsFragment, unknown>;
export const CurrentUserFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'CurrentUserFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'CurrentUser' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'identifier' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'channels' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'token' } },
                { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                { kind: 'Field', name: { kind: 'Name', value: 'permissions' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CurrentUserFieldsFragment, unknown>;
export const OrderLineFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrderLineFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'OrderLine' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'quantity' } },
          { kind: 'Field', name: { kind: 'Name', value: 'unitPriceWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'discountedUnitPriceWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'linePriceWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'discountedLinePriceWithTax' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'productVariant' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'sku' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'price' } },
                { kind: 'Field', name: { kind: 'Name', value: 'priceWithTax' } },
                { kind: 'Field', name: { kind: 'Name', value: 'currencyCode' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'product' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'options' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'groupId' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'featuredAsset' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'AssetFields' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'AssetFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Asset' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'source' } },
          { kind: 'Field', name: { kind: 'Name', value: 'preview' } },
          { kind: 'Field', name: { kind: 'Name', value: 'width' } },
          { kind: 'Field', name: { kind: 'Name', value: 'height' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mimeType' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<OrderLineFieldsFragment, unknown>;
export const OrderSummaryFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrderSummaryFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Order' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'code' } },
          { kind: 'Field', name: { kind: 'Name', value: 'state' } },
          { kind: 'Field', name: { kind: 'Name', value: 'active' } },
          { kind: 'Field', name: { kind: 'Name', value: 'totalQuantity' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currencyCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'subTotal' } },
          { kind: 'Field', name: { kind: 'Name', value: 'subTotalWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'shipping' } },
          { kind: 'Field', name: { kind: 'Name', value: 'shippingWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'total' } },
          { kind: 'Field', name: { kind: 'Name', value: 'totalWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'orderPlacedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'couponCodes' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'lines' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'OrderLineFields' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'AssetFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Asset' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'source' } },
          { kind: 'Field', name: { kind: 'Name', value: 'preview' } },
          { kind: 'Field', name: { kind: 'Name', value: 'width' } },
          { kind: 'Field', name: { kind: 'Name', value: 'height' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mimeType' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrderLineFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'OrderLine' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'quantity' } },
          { kind: 'Field', name: { kind: 'Name', value: 'unitPriceWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'discountedUnitPriceWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'linePriceWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'discountedLinePriceWithTax' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'productVariant' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'sku' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'price' } },
                { kind: 'Field', name: { kind: 'Name', value: 'priceWithTax' } },
                { kind: 'Field', name: { kind: 'Name', value: 'currencyCode' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'product' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'options' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'groupId' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'featuredAsset' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'AssetFields' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<OrderSummaryFieldsFragment, unknown>;
export const OrderAddressFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrderAddressFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'OrderAddress' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'company' } },
          { kind: 'Field', name: { kind: 'Name', value: 'streetLine1' } },
          { kind: 'Field', name: { kind: 'Name', value: 'streetLine2' } },
          { kind: 'Field', name: { kind: 'Name', value: 'city' } },
          { kind: 'Field', name: { kind: 'Name', value: 'province' } },
          { kind: 'Field', name: { kind: 'Name', value: 'postalCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'country' } },
          { kind: 'Field', name: { kind: 'Name', value: 'countryCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'phoneNumber' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<OrderAddressFieldsFragment, unknown>;
export const OrderDetailFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrderDetailFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Order' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'FragmentSpread', name: { kind: 'Name', value: 'OrderSummaryFields' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'customer' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'emailAddress' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'shippingAddress' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'OrderAddressFields' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'billingAddress' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'OrderAddressFields' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'shippingLines' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'priceWithTax' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'shippingMethod' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'payments' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'method' } },
                { kind: 'Field', name: { kind: 'Name', value: 'amount' } },
                { kind: 'Field', name: { kind: 'Name', value: 'state' } },
                { kind: 'Field', name: { kind: 'Name', value: 'transactionId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'errorMessage' } },
                { kind: 'Field', name: { kind: 'Name', value: 'metadata' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'discounts' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                { kind: 'Field', name: { kind: 'Name', value: 'amount' } },
                { kind: 'Field', name: { kind: 'Name', value: 'amountWithTax' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'AssetFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Asset' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'source' } },
          { kind: 'Field', name: { kind: 'Name', value: 'preview' } },
          { kind: 'Field', name: { kind: 'Name', value: 'width' } },
          { kind: 'Field', name: { kind: 'Name', value: 'height' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mimeType' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrderLineFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'OrderLine' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'quantity' } },
          { kind: 'Field', name: { kind: 'Name', value: 'unitPriceWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'discountedUnitPriceWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'linePriceWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'discountedLinePriceWithTax' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'productVariant' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'sku' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'price' } },
                { kind: 'Field', name: { kind: 'Name', value: 'priceWithTax' } },
                { kind: 'Field', name: { kind: 'Name', value: 'currencyCode' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'product' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'options' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'groupId' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'featuredAsset' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'AssetFields' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrderSummaryFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Order' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'code' } },
          { kind: 'Field', name: { kind: 'Name', value: 'state' } },
          { kind: 'Field', name: { kind: 'Name', value: 'active' } },
          { kind: 'Field', name: { kind: 'Name', value: 'totalQuantity' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currencyCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'subTotal' } },
          { kind: 'Field', name: { kind: 'Name', value: 'subTotalWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'shipping' } },
          { kind: 'Field', name: { kind: 'Name', value: 'shippingWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'total' } },
          { kind: 'Field', name: { kind: 'Name', value: 'totalWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'orderPlacedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'couponCodes' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'lines' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'OrderLineFields' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrderAddressFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'OrderAddress' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'company' } },
          { kind: 'Field', name: { kind: 'Name', value: 'streetLine1' } },
          { kind: 'Field', name: { kind: 'Name', value: 'streetLine2' } },
          { kind: 'Field', name: { kind: 'Name', value: 'city' } },
          { kind: 'Field', name: { kind: 'Name', value: 'province' } },
          { kind: 'Field', name: { kind: 'Name', value: 'postalCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'country' } },
          { kind: 'Field', name: { kind: 'Name', value: 'countryCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'phoneNumber' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<OrderDetailFieldsFragment, unknown>;
export const ProductCardFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ProductCardFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Product' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'featuredAsset' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'AssetFields' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'variantList' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'options' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'take' },
                      value: { kind: 'IntValue', value: '1' },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'items' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'sku' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'price' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'priceWithTax' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'currencyCode' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'customFields' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'activity' } }],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'AssetFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Asset' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'source' } },
          { kind: 'Field', name: { kind: 'Name', value: 'preview' } },
          { kind: 'Field', name: { kind: 'Name', value: 'width' } },
          { kind: 'Field', name: { kind: 'Name', value: 'height' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mimeType' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ProductCardFieldsFragment, unknown>;
export const ProductDetailVariantFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ProductDetailVariantFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ProductVariant' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'sku' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'price' } },
          { kind: 'Field', name: { kind: 'Name', value: 'priceWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currencyCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'stockLevel' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'featuredAsset' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'AssetFields' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'assets' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'AssetFields' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'options' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'groupId' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'AssetFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Asset' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'source' } },
          { kind: 'Field', name: { kind: 'Name', value: 'preview' } },
          { kind: 'Field', name: { kind: 'Name', value: 'width' } },
          { kind: 'Field', name: { kind: 'Name', value: 'height' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mimeType' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ProductDetailVariantFieldsFragment, unknown>;
export const ProductCustomFieldsFragmentFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ProductCustomFieldsFragment' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ProductCustomFields' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'activity' } },
          { kind: 'Field', name: { kind: 'Name', value: 'materialComposition' } },
          { kind: 'Field', name: { kind: 'Name', value: 'careInstructions' } },
          { kind: 'Field', name: { kind: 'Name', value: 'sustainabilityNotes' } },
          { kind: 'Field', name: { kind: 'Name', value: 'manufacturerInfo' } },
          { kind: 'Field', name: { kind: 'Name', value: 'warnings' } },
          { kind: 'Field', name: { kind: 'Name', value: 'traceabilityCode' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'responsiblePerson' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                { kind: 'Field', name: { kind: 'Name', value: 'address' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ProductCustomFieldsFragmentFragment, unknown>;
export const ProductDetailFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ProductDetailFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Product' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'featuredAsset' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'AssetFields' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'assets' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'AssetFields' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'collections' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'breadcrumbs' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'optionGroups' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'options' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'variants' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'ProductDetailVariantFields' },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'customFields' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'ProductCustomFieldsFragment' },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'AssetFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Asset' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'source' } },
          { kind: 'Field', name: { kind: 'Name', value: 'preview' } },
          { kind: 'Field', name: { kind: 'Name', value: 'width' } },
          { kind: 'Field', name: { kind: 'Name', value: 'height' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mimeType' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ProductDetailVariantFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ProductVariant' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'sku' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'price' } },
          { kind: 'Field', name: { kind: 'Name', value: 'priceWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currencyCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'stockLevel' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'featuredAsset' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'AssetFields' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'assets' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'AssetFields' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'options' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'groupId' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ProductCustomFieldsFragment' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ProductCustomFields' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'activity' } },
          { kind: 'Field', name: { kind: 'Name', value: 'materialComposition' } },
          { kind: 'Field', name: { kind: 'Name', value: 'careInstructions' } },
          { kind: 'Field', name: { kind: 'Name', value: 'sustainabilityNotes' } },
          { kind: 'Field', name: { kind: 'Name', value: 'manufacturerInfo' } },
          { kind: 'Field', name: { kind: 'Name', value: 'warnings' } },
          { kind: 'Field', name: { kind: 'Name', value: 'traceabilityCode' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'responsiblePerson' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                { kind: 'Field', name: { kind: 'Name', value: 'address' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ProductDetailFieldsFragment, unknown>;
export const SearchResultFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'SearchResultFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'SearchResult' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'productId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'productName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'productAsset' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'preview' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'focalPoint' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'x' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'y' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'priceWithTax' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'SinglePrice' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'value' } }],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'PriceRange' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'min' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'max' } },
                    ],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'currencyCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'collectionIds' } },
          { kind: 'Field', name: { kind: 'Name', value: 'facetValueIds' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<SearchResultFieldsFragment, unknown>;
export const SearchFacetValueResultFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'SearchFacetValueResultFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'FacetValueResult' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'count' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'facetValue' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'facet' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<SearchFacetValueResultFieldsFragment, unknown>;
export const CreateCustomerAddressDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateCustomerAddress' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'CreateAddressInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createCustomerAddress' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'AddressFields' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'AddressFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Address' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'company' } },
          { kind: 'Field', name: { kind: 'Name', value: 'streetLine1' } },
          { kind: 'Field', name: { kind: 'Name', value: 'streetLine2' } },
          { kind: 'Field', name: { kind: 'Name', value: 'city' } },
          { kind: 'Field', name: { kind: 'Name', value: 'province' } },
          { kind: 'Field', name: { kind: 'Name', value: 'postalCode' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'country' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'phoneNumber' } },
          { kind: 'Field', name: { kind: 'Name', value: 'defaultShippingAddress' } },
          { kind: 'Field', name: { kind: 'Name', value: 'defaultBillingAddress' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreateCustomerAddressMutation, CreateCustomerAddressMutationVariables>;
export const UpdateCustomerAddressDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateCustomerAddress' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'UpdateAddressInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateCustomerAddress' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'AddressFields' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'AddressFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Address' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'company' } },
          { kind: 'Field', name: { kind: 'Name', value: 'streetLine1' } },
          { kind: 'Field', name: { kind: 'Name', value: 'streetLine2' } },
          { kind: 'Field', name: { kind: 'Name', value: 'city' } },
          { kind: 'Field', name: { kind: 'Name', value: 'province' } },
          { kind: 'Field', name: { kind: 'Name', value: 'postalCode' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'country' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'phoneNumber' } },
          { kind: 'Field', name: { kind: 'Name', value: 'defaultShippingAddress' } },
          { kind: 'Field', name: { kind: 'Name', value: 'defaultBillingAddress' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateCustomerAddressMutation, UpdateCustomerAddressMutationVariables>;
export const DeleteCustomerAddressDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'DeleteCustomerAddress' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'deleteCustomerAddress' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'success' } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<DeleteCustomerAddressMutation, DeleteCustomerAddressMutationVariables>;
export const ActiveChannelDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'ActiveChannel' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'activeChannel' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'ChannelFields' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ChannelFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Channel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'code' } },
          { kind: 'Field', name: { kind: 'Name', value: 'token' } },
          { kind: 'Field', name: { kind: 'Name', value: 'defaultLanguageCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'availableLanguageCodes' } },
          { kind: 'Field', name: { kind: 'Name', value: 'defaultCurrencyCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'availableCurrencyCodes' } },
          { kind: 'Field', name: { kind: 'Name', value: 'pricesIncludeTax' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'defaultTaxZone' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'defaultShippingZone' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ActiveChannelQuery, ActiveChannelQueryVariables>;
export const AvailableCountriesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'AvailableCountries' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'availableCountries' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'CountryFields' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'CountryFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Country' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'code' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'enabled' } },
          { kind: 'Field', name: { kind: 'Name', value: 'languageCode' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<AvailableCountriesQuery, AvailableCountriesQueryVariables>;
export const AddItemToOrderDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'AddItemToOrder' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'productVariantId' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'quantity' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'addItemToOrder' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'productVariantId' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'productVariantId' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'quantity' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'quantity' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Order' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'FragmentSpread',
                        name: { kind: 'Name', value: 'OrderDetailFields' },
                      },
                    ],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'ErrorResult' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'FragmentSpread', name: { kind: 'Name', value: 'ErrorFields' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'AssetFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Asset' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'source' } },
          { kind: 'Field', name: { kind: 'Name', value: 'preview' } },
          { kind: 'Field', name: { kind: 'Name', value: 'width' } },
          { kind: 'Field', name: { kind: 'Name', value: 'height' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mimeType' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrderLineFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'OrderLine' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'quantity' } },
          { kind: 'Field', name: { kind: 'Name', value: 'unitPriceWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'discountedUnitPriceWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'linePriceWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'discountedLinePriceWithTax' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'productVariant' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'sku' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'price' } },
                { kind: 'Field', name: { kind: 'Name', value: 'priceWithTax' } },
                { kind: 'Field', name: { kind: 'Name', value: 'currencyCode' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'product' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'options' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'groupId' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'featuredAsset' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'AssetFields' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrderSummaryFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Order' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'code' } },
          { kind: 'Field', name: { kind: 'Name', value: 'state' } },
          { kind: 'Field', name: { kind: 'Name', value: 'active' } },
          { kind: 'Field', name: { kind: 'Name', value: 'totalQuantity' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currencyCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'subTotal' } },
          { kind: 'Field', name: { kind: 'Name', value: 'subTotalWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'shipping' } },
          { kind: 'Field', name: { kind: 'Name', value: 'shippingWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'total' } },
          { kind: 'Field', name: { kind: 'Name', value: 'totalWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'orderPlacedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'couponCodes' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'lines' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'OrderLineFields' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrderAddressFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'OrderAddress' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'company' } },
          { kind: 'Field', name: { kind: 'Name', value: 'streetLine1' } },
          { kind: 'Field', name: { kind: 'Name', value: 'streetLine2' } },
          { kind: 'Field', name: { kind: 'Name', value: 'city' } },
          { kind: 'Field', name: { kind: 'Name', value: 'province' } },
          { kind: 'Field', name: { kind: 'Name', value: 'postalCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'country' } },
          { kind: 'Field', name: { kind: 'Name', value: 'countryCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'phoneNumber' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrderDetailFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Order' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'FragmentSpread', name: { kind: 'Name', value: 'OrderSummaryFields' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'customer' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'emailAddress' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'shippingAddress' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'OrderAddressFields' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'billingAddress' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'OrderAddressFields' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'shippingLines' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'priceWithTax' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'shippingMethod' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'payments' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'method' } },
                { kind: 'Field', name: { kind: 'Name', value: 'amount' } },
                { kind: 'Field', name: { kind: 'Name', value: 'state' } },
                { kind: 'Field', name: { kind: 'Name', value: 'transactionId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'errorMessage' } },
                { kind: 'Field', name: { kind: 'Name', value: 'metadata' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'discounts' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                { kind: 'Field', name: { kind: 'Name', value: 'amount' } },
                { kind: 'Field', name: { kind: 'Name', value: 'amountWithTax' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ErrorFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ErrorResult' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'errorCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'message' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<AddItemToOrderMutation, AddItemToOrderMutationVariables>;
export const AdjustOrderLineDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'AdjustOrderLine' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'orderLineId' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'quantity' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'adjustOrderLine' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'orderLineId' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'orderLineId' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'quantity' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'quantity' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Order' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'FragmentSpread',
                        name: { kind: 'Name', value: 'OrderDetailFields' },
                      },
                    ],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'ErrorResult' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'FragmentSpread', name: { kind: 'Name', value: 'ErrorFields' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'AssetFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Asset' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'source' } },
          { kind: 'Field', name: { kind: 'Name', value: 'preview' } },
          { kind: 'Field', name: { kind: 'Name', value: 'width' } },
          { kind: 'Field', name: { kind: 'Name', value: 'height' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mimeType' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrderLineFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'OrderLine' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'quantity' } },
          { kind: 'Field', name: { kind: 'Name', value: 'unitPriceWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'discountedUnitPriceWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'linePriceWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'discountedLinePriceWithTax' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'productVariant' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'sku' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'price' } },
                { kind: 'Field', name: { kind: 'Name', value: 'priceWithTax' } },
                { kind: 'Field', name: { kind: 'Name', value: 'currencyCode' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'product' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'options' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'groupId' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'featuredAsset' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'AssetFields' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrderSummaryFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Order' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'code' } },
          { kind: 'Field', name: { kind: 'Name', value: 'state' } },
          { kind: 'Field', name: { kind: 'Name', value: 'active' } },
          { kind: 'Field', name: { kind: 'Name', value: 'totalQuantity' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currencyCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'subTotal' } },
          { kind: 'Field', name: { kind: 'Name', value: 'subTotalWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'shipping' } },
          { kind: 'Field', name: { kind: 'Name', value: 'shippingWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'total' } },
          { kind: 'Field', name: { kind: 'Name', value: 'totalWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'orderPlacedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'couponCodes' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'lines' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'OrderLineFields' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrderAddressFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'OrderAddress' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'company' } },
          { kind: 'Field', name: { kind: 'Name', value: 'streetLine1' } },
          { kind: 'Field', name: { kind: 'Name', value: 'streetLine2' } },
          { kind: 'Field', name: { kind: 'Name', value: 'city' } },
          { kind: 'Field', name: { kind: 'Name', value: 'province' } },
          { kind: 'Field', name: { kind: 'Name', value: 'postalCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'country' } },
          { kind: 'Field', name: { kind: 'Name', value: 'countryCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'phoneNumber' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrderDetailFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Order' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'FragmentSpread', name: { kind: 'Name', value: 'OrderSummaryFields' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'customer' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'emailAddress' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'shippingAddress' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'OrderAddressFields' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'billingAddress' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'OrderAddressFields' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'shippingLines' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'priceWithTax' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'shippingMethod' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'payments' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'method' } },
                { kind: 'Field', name: { kind: 'Name', value: 'amount' } },
                { kind: 'Field', name: { kind: 'Name', value: 'state' } },
                { kind: 'Field', name: { kind: 'Name', value: 'transactionId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'errorMessage' } },
                { kind: 'Field', name: { kind: 'Name', value: 'metadata' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'discounts' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                { kind: 'Field', name: { kind: 'Name', value: 'amount' } },
                { kind: 'Field', name: { kind: 'Name', value: 'amountWithTax' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ErrorFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ErrorResult' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'errorCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'message' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<AdjustOrderLineMutation, AdjustOrderLineMutationVariables>;
export const RemoveOrderLineDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'RemoveOrderLine' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'orderLineId' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'removeOrderLine' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'orderLineId' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'orderLineId' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Order' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'FragmentSpread',
                        name: { kind: 'Name', value: 'OrderDetailFields' },
                      },
                    ],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'ErrorResult' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'FragmentSpread', name: { kind: 'Name', value: 'ErrorFields' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'AssetFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Asset' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'source' } },
          { kind: 'Field', name: { kind: 'Name', value: 'preview' } },
          { kind: 'Field', name: { kind: 'Name', value: 'width' } },
          { kind: 'Field', name: { kind: 'Name', value: 'height' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mimeType' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrderLineFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'OrderLine' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'quantity' } },
          { kind: 'Field', name: { kind: 'Name', value: 'unitPriceWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'discountedUnitPriceWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'linePriceWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'discountedLinePriceWithTax' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'productVariant' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'sku' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'price' } },
                { kind: 'Field', name: { kind: 'Name', value: 'priceWithTax' } },
                { kind: 'Field', name: { kind: 'Name', value: 'currencyCode' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'product' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'options' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'groupId' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'featuredAsset' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'AssetFields' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrderSummaryFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Order' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'code' } },
          { kind: 'Field', name: { kind: 'Name', value: 'state' } },
          { kind: 'Field', name: { kind: 'Name', value: 'active' } },
          { kind: 'Field', name: { kind: 'Name', value: 'totalQuantity' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currencyCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'subTotal' } },
          { kind: 'Field', name: { kind: 'Name', value: 'subTotalWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'shipping' } },
          { kind: 'Field', name: { kind: 'Name', value: 'shippingWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'total' } },
          { kind: 'Field', name: { kind: 'Name', value: 'totalWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'orderPlacedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'couponCodes' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'lines' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'OrderLineFields' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrderAddressFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'OrderAddress' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'company' } },
          { kind: 'Field', name: { kind: 'Name', value: 'streetLine1' } },
          { kind: 'Field', name: { kind: 'Name', value: 'streetLine2' } },
          { kind: 'Field', name: { kind: 'Name', value: 'city' } },
          { kind: 'Field', name: { kind: 'Name', value: 'province' } },
          { kind: 'Field', name: { kind: 'Name', value: 'postalCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'country' } },
          { kind: 'Field', name: { kind: 'Name', value: 'countryCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'phoneNumber' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrderDetailFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Order' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'FragmentSpread', name: { kind: 'Name', value: 'OrderSummaryFields' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'customer' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'emailAddress' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'shippingAddress' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'OrderAddressFields' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'billingAddress' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'OrderAddressFields' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'shippingLines' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'priceWithTax' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'shippingMethod' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'payments' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'method' } },
                { kind: 'Field', name: { kind: 'Name', value: 'amount' } },
                { kind: 'Field', name: { kind: 'Name', value: 'state' } },
                { kind: 'Field', name: { kind: 'Name', value: 'transactionId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'errorMessage' } },
                { kind: 'Field', name: { kind: 'Name', value: 'metadata' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'discounts' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                { kind: 'Field', name: { kind: 'Name', value: 'amount' } },
                { kind: 'Field', name: { kind: 'Name', value: 'amountWithTax' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ErrorFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ErrorResult' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'errorCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'message' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<RemoveOrderLineMutation, RemoveOrderLineMutationVariables>;
export const RemoveAllOrderLinesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'RemoveAllOrderLines' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'removeAllOrderLines' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Order' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'FragmentSpread',
                        name: { kind: 'Name', value: 'OrderDetailFields' },
                      },
                    ],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'ErrorResult' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'FragmentSpread', name: { kind: 'Name', value: 'ErrorFields' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'AssetFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Asset' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'source' } },
          { kind: 'Field', name: { kind: 'Name', value: 'preview' } },
          { kind: 'Field', name: { kind: 'Name', value: 'width' } },
          { kind: 'Field', name: { kind: 'Name', value: 'height' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mimeType' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrderLineFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'OrderLine' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'quantity' } },
          { kind: 'Field', name: { kind: 'Name', value: 'unitPriceWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'discountedUnitPriceWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'linePriceWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'discountedLinePriceWithTax' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'productVariant' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'sku' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'price' } },
                { kind: 'Field', name: { kind: 'Name', value: 'priceWithTax' } },
                { kind: 'Field', name: { kind: 'Name', value: 'currencyCode' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'product' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'options' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'groupId' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'featuredAsset' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'AssetFields' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrderSummaryFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Order' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'code' } },
          { kind: 'Field', name: { kind: 'Name', value: 'state' } },
          { kind: 'Field', name: { kind: 'Name', value: 'active' } },
          { kind: 'Field', name: { kind: 'Name', value: 'totalQuantity' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currencyCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'subTotal' } },
          { kind: 'Field', name: { kind: 'Name', value: 'subTotalWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'shipping' } },
          { kind: 'Field', name: { kind: 'Name', value: 'shippingWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'total' } },
          { kind: 'Field', name: { kind: 'Name', value: 'totalWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'orderPlacedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'couponCodes' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'lines' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'OrderLineFields' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrderAddressFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'OrderAddress' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'company' } },
          { kind: 'Field', name: { kind: 'Name', value: 'streetLine1' } },
          { kind: 'Field', name: { kind: 'Name', value: 'streetLine2' } },
          { kind: 'Field', name: { kind: 'Name', value: 'city' } },
          { kind: 'Field', name: { kind: 'Name', value: 'province' } },
          { kind: 'Field', name: { kind: 'Name', value: 'postalCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'country' } },
          { kind: 'Field', name: { kind: 'Name', value: 'countryCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'phoneNumber' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrderDetailFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Order' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'FragmentSpread', name: { kind: 'Name', value: 'OrderSummaryFields' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'customer' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'emailAddress' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'shippingAddress' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'OrderAddressFields' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'billingAddress' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'OrderAddressFields' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'shippingLines' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'priceWithTax' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'shippingMethod' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'payments' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'method' } },
                { kind: 'Field', name: { kind: 'Name', value: 'amount' } },
                { kind: 'Field', name: { kind: 'Name', value: 'state' } },
                { kind: 'Field', name: { kind: 'Name', value: 'transactionId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'errorMessage' } },
                { kind: 'Field', name: { kind: 'Name', value: 'metadata' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'discounts' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                { kind: 'Field', name: { kind: 'Name', value: 'amount' } },
                { kind: 'Field', name: { kind: 'Name', value: 'amountWithTax' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ErrorFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ErrorResult' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'errorCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'message' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<RemoveAllOrderLinesMutation, RemoveAllOrderLinesMutationVariables>;
export const ApplyCouponCodeDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'ApplyCouponCode' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'couponCode' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'applyCouponCode' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'couponCode' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'couponCode' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Order' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'FragmentSpread',
                        name: { kind: 'Name', value: 'OrderDetailFields' },
                      },
                    ],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'ErrorResult' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'FragmentSpread', name: { kind: 'Name', value: 'ErrorFields' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'AssetFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Asset' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'source' } },
          { kind: 'Field', name: { kind: 'Name', value: 'preview' } },
          { kind: 'Field', name: { kind: 'Name', value: 'width' } },
          { kind: 'Field', name: { kind: 'Name', value: 'height' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mimeType' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrderLineFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'OrderLine' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'quantity' } },
          { kind: 'Field', name: { kind: 'Name', value: 'unitPriceWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'discountedUnitPriceWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'linePriceWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'discountedLinePriceWithTax' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'productVariant' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'sku' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'price' } },
                { kind: 'Field', name: { kind: 'Name', value: 'priceWithTax' } },
                { kind: 'Field', name: { kind: 'Name', value: 'currencyCode' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'product' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'options' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'groupId' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'featuredAsset' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'AssetFields' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrderSummaryFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Order' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'code' } },
          { kind: 'Field', name: { kind: 'Name', value: 'state' } },
          { kind: 'Field', name: { kind: 'Name', value: 'active' } },
          { kind: 'Field', name: { kind: 'Name', value: 'totalQuantity' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currencyCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'subTotal' } },
          { kind: 'Field', name: { kind: 'Name', value: 'subTotalWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'shipping' } },
          { kind: 'Field', name: { kind: 'Name', value: 'shippingWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'total' } },
          { kind: 'Field', name: { kind: 'Name', value: 'totalWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'orderPlacedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'couponCodes' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'lines' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'OrderLineFields' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrderAddressFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'OrderAddress' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'company' } },
          { kind: 'Field', name: { kind: 'Name', value: 'streetLine1' } },
          { kind: 'Field', name: { kind: 'Name', value: 'streetLine2' } },
          { kind: 'Field', name: { kind: 'Name', value: 'city' } },
          { kind: 'Field', name: { kind: 'Name', value: 'province' } },
          { kind: 'Field', name: { kind: 'Name', value: 'postalCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'country' } },
          { kind: 'Field', name: { kind: 'Name', value: 'countryCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'phoneNumber' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrderDetailFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Order' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'FragmentSpread', name: { kind: 'Name', value: 'OrderSummaryFields' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'customer' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'emailAddress' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'shippingAddress' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'OrderAddressFields' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'billingAddress' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'OrderAddressFields' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'shippingLines' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'priceWithTax' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'shippingMethod' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'payments' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'method' } },
                { kind: 'Field', name: { kind: 'Name', value: 'amount' } },
                { kind: 'Field', name: { kind: 'Name', value: 'state' } },
                { kind: 'Field', name: { kind: 'Name', value: 'transactionId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'errorMessage' } },
                { kind: 'Field', name: { kind: 'Name', value: 'metadata' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'discounts' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                { kind: 'Field', name: { kind: 'Name', value: 'amount' } },
                { kind: 'Field', name: { kind: 'Name', value: 'amountWithTax' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ErrorFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ErrorResult' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'errorCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'message' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ApplyCouponCodeMutation, ApplyCouponCodeMutationVariables>;
export const RemoveCouponCodeDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'RemoveCouponCode' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'couponCode' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'removeCouponCode' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'couponCode' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'couponCode' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'OrderDetailFields' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'AssetFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Asset' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'source' } },
          { kind: 'Field', name: { kind: 'Name', value: 'preview' } },
          { kind: 'Field', name: { kind: 'Name', value: 'width' } },
          { kind: 'Field', name: { kind: 'Name', value: 'height' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mimeType' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrderLineFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'OrderLine' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'quantity' } },
          { kind: 'Field', name: { kind: 'Name', value: 'unitPriceWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'discountedUnitPriceWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'linePriceWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'discountedLinePriceWithTax' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'productVariant' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'sku' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'price' } },
                { kind: 'Field', name: { kind: 'Name', value: 'priceWithTax' } },
                { kind: 'Field', name: { kind: 'Name', value: 'currencyCode' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'product' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'options' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'groupId' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'featuredAsset' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'AssetFields' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrderSummaryFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Order' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'code' } },
          { kind: 'Field', name: { kind: 'Name', value: 'state' } },
          { kind: 'Field', name: { kind: 'Name', value: 'active' } },
          { kind: 'Field', name: { kind: 'Name', value: 'totalQuantity' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currencyCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'subTotal' } },
          { kind: 'Field', name: { kind: 'Name', value: 'subTotalWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'shipping' } },
          { kind: 'Field', name: { kind: 'Name', value: 'shippingWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'total' } },
          { kind: 'Field', name: { kind: 'Name', value: 'totalWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'orderPlacedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'couponCodes' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'lines' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'OrderLineFields' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrderAddressFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'OrderAddress' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'company' } },
          { kind: 'Field', name: { kind: 'Name', value: 'streetLine1' } },
          { kind: 'Field', name: { kind: 'Name', value: 'streetLine2' } },
          { kind: 'Field', name: { kind: 'Name', value: 'city' } },
          { kind: 'Field', name: { kind: 'Name', value: 'province' } },
          { kind: 'Field', name: { kind: 'Name', value: 'postalCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'country' } },
          { kind: 'Field', name: { kind: 'Name', value: 'countryCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'phoneNumber' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrderDetailFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Order' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'FragmentSpread', name: { kind: 'Name', value: 'OrderSummaryFields' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'customer' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'emailAddress' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'shippingAddress' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'OrderAddressFields' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'billingAddress' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'OrderAddressFields' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'shippingLines' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'priceWithTax' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'shippingMethod' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'payments' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'method' } },
                { kind: 'Field', name: { kind: 'Name', value: 'amount' } },
                { kind: 'Field', name: { kind: 'Name', value: 'state' } },
                { kind: 'Field', name: { kind: 'Name', value: 'transactionId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'errorMessage' } },
                { kind: 'Field', name: { kind: 'Name', value: 'metadata' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'discounts' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                { kind: 'Field', name: { kind: 'Name', value: 'amount' } },
                { kind: 'Field', name: { kind: 'Name', value: 'amountWithTax' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<RemoveCouponCodeMutation, RemoveCouponCodeMutationVariables>;
export const SetCustomerForOrderDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'SetCustomerForOrder' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'CreateCustomerInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'setCustomerForOrder' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Order' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'FragmentSpread',
                        name: { kind: 'Name', value: 'OrderDetailFields' },
                      },
                    ],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'ErrorResult' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'FragmentSpread', name: { kind: 'Name', value: 'ErrorFields' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'AssetFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Asset' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'source' } },
          { kind: 'Field', name: { kind: 'Name', value: 'preview' } },
          { kind: 'Field', name: { kind: 'Name', value: 'width' } },
          { kind: 'Field', name: { kind: 'Name', value: 'height' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mimeType' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrderLineFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'OrderLine' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'quantity' } },
          { kind: 'Field', name: { kind: 'Name', value: 'unitPriceWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'discountedUnitPriceWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'linePriceWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'discountedLinePriceWithTax' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'productVariant' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'sku' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'price' } },
                { kind: 'Field', name: { kind: 'Name', value: 'priceWithTax' } },
                { kind: 'Field', name: { kind: 'Name', value: 'currencyCode' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'product' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'options' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'groupId' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'featuredAsset' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'AssetFields' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrderSummaryFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Order' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'code' } },
          { kind: 'Field', name: { kind: 'Name', value: 'state' } },
          { kind: 'Field', name: { kind: 'Name', value: 'active' } },
          { kind: 'Field', name: { kind: 'Name', value: 'totalQuantity' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currencyCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'subTotal' } },
          { kind: 'Field', name: { kind: 'Name', value: 'subTotalWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'shipping' } },
          { kind: 'Field', name: { kind: 'Name', value: 'shippingWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'total' } },
          { kind: 'Field', name: { kind: 'Name', value: 'totalWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'orderPlacedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'couponCodes' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'lines' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'OrderLineFields' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrderAddressFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'OrderAddress' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'company' } },
          { kind: 'Field', name: { kind: 'Name', value: 'streetLine1' } },
          { kind: 'Field', name: { kind: 'Name', value: 'streetLine2' } },
          { kind: 'Field', name: { kind: 'Name', value: 'city' } },
          { kind: 'Field', name: { kind: 'Name', value: 'province' } },
          { kind: 'Field', name: { kind: 'Name', value: 'postalCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'country' } },
          { kind: 'Field', name: { kind: 'Name', value: 'countryCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'phoneNumber' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrderDetailFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Order' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'FragmentSpread', name: { kind: 'Name', value: 'OrderSummaryFields' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'customer' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'emailAddress' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'shippingAddress' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'OrderAddressFields' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'billingAddress' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'OrderAddressFields' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'shippingLines' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'priceWithTax' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'shippingMethod' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'payments' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'method' } },
                { kind: 'Field', name: { kind: 'Name', value: 'amount' } },
                { kind: 'Field', name: { kind: 'Name', value: 'state' } },
                { kind: 'Field', name: { kind: 'Name', value: 'transactionId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'errorMessage' } },
                { kind: 'Field', name: { kind: 'Name', value: 'metadata' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'discounts' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                { kind: 'Field', name: { kind: 'Name', value: 'amount' } },
                { kind: 'Field', name: { kind: 'Name', value: 'amountWithTax' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ErrorFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ErrorResult' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'errorCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'message' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<SetCustomerForOrderMutation, SetCustomerForOrderMutationVariables>;
export const SetOrderShippingAddressDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'SetOrderShippingAddress' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'CreateAddressInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'setOrderShippingAddress' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Order' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'FragmentSpread',
                        name: { kind: 'Name', value: 'OrderDetailFields' },
                      },
                    ],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'ErrorResult' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'FragmentSpread', name: { kind: 'Name', value: 'ErrorFields' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'AssetFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Asset' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'source' } },
          { kind: 'Field', name: { kind: 'Name', value: 'preview' } },
          { kind: 'Field', name: { kind: 'Name', value: 'width' } },
          { kind: 'Field', name: { kind: 'Name', value: 'height' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mimeType' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrderLineFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'OrderLine' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'quantity' } },
          { kind: 'Field', name: { kind: 'Name', value: 'unitPriceWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'discountedUnitPriceWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'linePriceWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'discountedLinePriceWithTax' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'productVariant' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'sku' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'price' } },
                { kind: 'Field', name: { kind: 'Name', value: 'priceWithTax' } },
                { kind: 'Field', name: { kind: 'Name', value: 'currencyCode' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'product' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'options' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'groupId' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'featuredAsset' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'AssetFields' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrderSummaryFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Order' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'code' } },
          { kind: 'Field', name: { kind: 'Name', value: 'state' } },
          { kind: 'Field', name: { kind: 'Name', value: 'active' } },
          { kind: 'Field', name: { kind: 'Name', value: 'totalQuantity' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currencyCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'subTotal' } },
          { kind: 'Field', name: { kind: 'Name', value: 'subTotalWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'shipping' } },
          { kind: 'Field', name: { kind: 'Name', value: 'shippingWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'total' } },
          { kind: 'Field', name: { kind: 'Name', value: 'totalWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'orderPlacedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'couponCodes' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'lines' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'OrderLineFields' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrderAddressFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'OrderAddress' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'company' } },
          { kind: 'Field', name: { kind: 'Name', value: 'streetLine1' } },
          { kind: 'Field', name: { kind: 'Name', value: 'streetLine2' } },
          { kind: 'Field', name: { kind: 'Name', value: 'city' } },
          { kind: 'Field', name: { kind: 'Name', value: 'province' } },
          { kind: 'Field', name: { kind: 'Name', value: 'postalCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'country' } },
          { kind: 'Field', name: { kind: 'Name', value: 'countryCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'phoneNumber' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrderDetailFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Order' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'FragmentSpread', name: { kind: 'Name', value: 'OrderSummaryFields' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'customer' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'emailAddress' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'shippingAddress' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'OrderAddressFields' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'billingAddress' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'OrderAddressFields' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'shippingLines' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'priceWithTax' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'shippingMethod' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'payments' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'method' } },
                { kind: 'Field', name: { kind: 'Name', value: 'amount' } },
                { kind: 'Field', name: { kind: 'Name', value: 'state' } },
                { kind: 'Field', name: { kind: 'Name', value: 'transactionId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'errorMessage' } },
                { kind: 'Field', name: { kind: 'Name', value: 'metadata' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'discounts' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                { kind: 'Field', name: { kind: 'Name', value: 'amount' } },
                { kind: 'Field', name: { kind: 'Name', value: 'amountWithTax' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ErrorFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ErrorResult' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'errorCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'message' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  SetOrderShippingAddressMutation,
  SetOrderShippingAddressMutationVariables
>;
export const SetOrderBillingAddressDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'SetOrderBillingAddress' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'CreateAddressInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'setOrderBillingAddress' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Order' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'FragmentSpread',
                        name: { kind: 'Name', value: 'OrderDetailFields' },
                      },
                    ],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'ErrorResult' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'FragmentSpread', name: { kind: 'Name', value: 'ErrorFields' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'AssetFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Asset' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'source' } },
          { kind: 'Field', name: { kind: 'Name', value: 'preview' } },
          { kind: 'Field', name: { kind: 'Name', value: 'width' } },
          { kind: 'Field', name: { kind: 'Name', value: 'height' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mimeType' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrderLineFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'OrderLine' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'quantity' } },
          { kind: 'Field', name: { kind: 'Name', value: 'unitPriceWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'discountedUnitPriceWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'linePriceWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'discountedLinePriceWithTax' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'productVariant' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'sku' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'price' } },
                { kind: 'Field', name: { kind: 'Name', value: 'priceWithTax' } },
                { kind: 'Field', name: { kind: 'Name', value: 'currencyCode' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'product' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'options' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'groupId' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'featuredAsset' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'AssetFields' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrderSummaryFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Order' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'code' } },
          { kind: 'Field', name: { kind: 'Name', value: 'state' } },
          { kind: 'Field', name: { kind: 'Name', value: 'active' } },
          { kind: 'Field', name: { kind: 'Name', value: 'totalQuantity' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currencyCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'subTotal' } },
          { kind: 'Field', name: { kind: 'Name', value: 'subTotalWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'shipping' } },
          { kind: 'Field', name: { kind: 'Name', value: 'shippingWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'total' } },
          { kind: 'Field', name: { kind: 'Name', value: 'totalWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'orderPlacedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'couponCodes' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'lines' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'OrderLineFields' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrderAddressFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'OrderAddress' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'company' } },
          { kind: 'Field', name: { kind: 'Name', value: 'streetLine1' } },
          { kind: 'Field', name: { kind: 'Name', value: 'streetLine2' } },
          { kind: 'Field', name: { kind: 'Name', value: 'city' } },
          { kind: 'Field', name: { kind: 'Name', value: 'province' } },
          { kind: 'Field', name: { kind: 'Name', value: 'postalCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'country' } },
          { kind: 'Field', name: { kind: 'Name', value: 'countryCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'phoneNumber' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrderDetailFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Order' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'FragmentSpread', name: { kind: 'Name', value: 'OrderSummaryFields' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'customer' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'emailAddress' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'shippingAddress' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'OrderAddressFields' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'billingAddress' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'OrderAddressFields' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'shippingLines' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'priceWithTax' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'shippingMethod' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'payments' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'method' } },
                { kind: 'Field', name: { kind: 'Name', value: 'amount' } },
                { kind: 'Field', name: { kind: 'Name', value: 'state' } },
                { kind: 'Field', name: { kind: 'Name', value: 'transactionId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'errorMessage' } },
                { kind: 'Field', name: { kind: 'Name', value: 'metadata' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'discounts' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                { kind: 'Field', name: { kind: 'Name', value: 'amount' } },
                { kind: 'Field', name: { kind: 'Name', value: 'amountWithTax' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ErrorFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ErrorResult' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'errorCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'message' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  SetOrderBillingAddressMutation,
  SetOrderBillingAddressMutationVariables
>;
export const SetOrderShippingMethodDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'SetOrderShippingMethod' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'shippingMethodId' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'ListType',
              type: {
                kind: 'NonNullType',
                type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'setOrderShippingMethod' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'shippingMethodId' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'shippingMethodId' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Order' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'FragmentSpread',
                        name: { kind: 'Name', value: 'OrderDetailFields' },
                      },
                    ],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'ErrorResult' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'FragmentSpread', name: { kind: 'Name', value: 'ErrorFields' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'AssetFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Asset' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'source' } },
          { kind: 'Field', name: { kind: 'Name', value: 'preview' } },
          { kind: 'Field', name: { kind: 'Name', value: 'width' } },
          { kind: 'Field', name: { kind: 'Name', value: 'height' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mimeType' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrderLineFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'OrderLine' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'quantity' } },
          { kind: 'Field', name: { kind: 'Name', value: 'unitPriceWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'discountedUnitPriceWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'linePriceWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'discountedLinePriceWithTax' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'productVariant' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'sku' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'price' } },
                { kind: 'Field', name: { kind: 'Name', value: 'priceWithTax' } },
                { kind: 'Field', name: { kind: 'Name', value: 'currencyCode' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'product' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'options' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'groupId' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'featuredAsset' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'AssetFields' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrderSummaryFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Order' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'code' } },
          { kind: 'Field', name: { kind: 'Name', value: 'state' } },
          { kind: 'Field', name: { kind: 'Name', value: 'active' } },
          { kind: 'Field', name: { kind: 'Name', value: 'totalQuantity' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currencyCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'subTotal' } },
          { kind: 'Field', name: { kind: 'Name', value: 'subTotalWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'shipping' } },
          { kind: 'Field', name: { kind: 'Name', value: 'shippingWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'total' } },
          { kind: 'Field', name: { kind: 'Name', value: 'totalWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'orderPlacedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'couponCodes' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'lines' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'OrderLineFields' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrderAddressFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'OrderAddress' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'company' } },
          { kind: 'Field', name: { kind: 'Name', value: 'streetLine1' } },
          { kind: 'Field', name: { kind: 'Name', value: 'streetLine2' } },
          { kind: 'Field', name: { kind: 'Name', value: 'city' } },
          { kind: 'Field', name: { kind: 'Name', value: 'province' } },
          { kind: 'Field', name: { kind: 'Name', value: 'postalCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'country' } },
          { kind: 'Field', name: { kind: 'Name', value: 'countryCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'phoneNumber' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrderDetailFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Order' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'FragmentSpread', name: { kind: 'Name', value: 'OrderSummaryFields' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'customer' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'emailAddress' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'shippingAddress' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'OrderAddressFields' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'billingAddress' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'OrderAddressFields' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'shippingLines' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'priceWithTax' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'shippingMethod' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'payments' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'method' } },
                { kind: 'Field', name: { kind: 'Name', value: 'amount' } },
                { kind: 'Field', name: { kind: 'Name', value: 'state' } },
                { kind: 'Field', name: { kind: 'Name', value: 'transactionId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'errorMessage' } },
                { kind: 'Field', name: { kind: 'Name', value: 'metadata' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'discounts' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                { kind: 'Field', name: { kind: 'Name', value: 'amount' } },
                { kind: 'Field', name: { kind: 'Name', value: 'amountWithTax' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ErrorFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ErrorResult' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'errorCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'message' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  SetOrderShippingMethodMutation,
  SetOrderShippingMethodMutationVariables
>;
export const EligibleShippingMethodsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'EligibleShippingMethods' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'eligibleShippingMethods' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'ShippingMethodQuoteFields' },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ShippingMethodQuoteFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ShippingMethodQuote' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'code' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'price' } },
          { kind: 'Field', name: { kind: 'Name', value: 'priceWithTax' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<EligibleShippingMethodsQuery, EligibleShippingMethodsQueryVariables>;
export const EligiblePaymentMethodsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'EligiblePaymentMethods' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'eligiblePaymentMethods' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'PaymentMethodQuoteFields' },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'PaymentMethodQuoteFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'PaymentMethodQuote' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'code' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'isEligible' } },
          { kind: 'Field', name: { kind: 'Name', value: 'eligibilityMessage' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<EligiblePaymentMethodsQuery, EligiblePaymentMethodsQueryVariables>;
export const NextOrderStatesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'NextOrderStates' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [{ kind: 'Field', name: { kind: 'Name', value: 'nextOrderStates' } }],
      },
    },
  ],
} as unknown as DocumentNode<NextOrderStatesQuery, NextOrderStatesQueryVariables>;
export const TransitionOrderToStateDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'TransitionOrderToState' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'state' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'transitionOrderToState' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'state' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'state' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Order' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'FragmentSpread',
                        name: { kind: 'Name', value: 'OrderDetailFields' },
                      },
                    ],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'ErrorResult' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'FragmentSpread', name: { kind: 'Name', value: 'ErrorFields' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'AssetFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Asset' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'source' } },
          { kind: 'Field', name: { kind: 'Name', value: 'preview' } },
          { kind: 'Field', name: { kind: 'Name', value: 'width' } },
          { kind: 'Field', name: { kind: 'Name', value: 'height' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mimeType' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrderLineFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'OrderLine' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'quantity' } },
          { kind: 'Field', name: { kind: 'Name', value: 'unitPriceWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'discountedUnitPriceWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'linePriceWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'discountedLinePriceWithTax' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'productVariant' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'sku' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'price' } },
                { kind: 'Field', name: { kind: 'Name', value: 'priceWithTax' } },
                { kind: 'Field', name: { kind: 'Name', value: 'currencyCode' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'product' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'options' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'groupId' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'featuredAsset' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'AssetFields' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrderSummaryFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Order' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'code' } },
          { kind: 'Field', name: { kind: 'Name', value: 'state' } },
          { kind: 'Field', name: { kind: 'Name', value: 'active' } },
          { kind: 'Field', name: { kind: 'Name', value: 'totalQuantity' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currencyCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'subTotal' } },
          { kind: 'Field', name: { kind: 'Name', value: 'subTotalWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'shipping' } },
          { kind: 'Field', name: { kind: 'Name', value: 'shippingWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'total' } },
          { kind: 'Field', name: { kind: 'Name', value: 'totalWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'orderPlacedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'couponCodes' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'lines' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'OrderLineFields' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrderAddressFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'OrderAddress' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'company' } },
          { kind: 'Field', name: { kind: 'Name', value: 'streetLine1' } },
          { kind: 'Field', name: { kind: 'Name', value: 'streetLine2' } },
          { kind: 'Field', name: { kind: 'Name', value: 'city' } },
          { kind: 'Field', name: { kind: 'Name', value: 'province' } },
          { kind: 'Field', name: { kind: 'Name', value: 'postalCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'country' } },
          { kind: 'Field', name: { kind: 'Name', value: 'countryCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'phoneNumber' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrderDetailFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Order' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'FragmentSpread', name: { kind: 'Name', value: 'OrderSummaryFields' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'customer' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'emailAddress' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'shippingAddress' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'OrderAddressFields' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'billingAddress' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'OrderAddressFields' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'shippingLines' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'priceWithTax' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'shippingMethod' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'payments' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'method' } },
                { kind: 'Field', name: { kind: 'Name', value: 'amount' } },
                { kind: 'Field', name: { kind: 'Name', value: 'state' } },
                { kind: 'Field', name: { kind: 'Name', value: 'transactionId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'errorMessage' } },
                { kind: 'Field', name: { kind: 'Name', value: 'metadata' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'discounts' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                { kind: 'Field', name: { kind: 'Name', value: 'amount' } },
                { kind: 'Field', name: { kind: 'Name', value: 'amountWithTax' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ErrorFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ErrorResult' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'errorCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'message' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  TransitionOrderToStateMutation,
  TransitionOrderToStateMutationVariables
>;
export const AddPaymentToOrderDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'AddPaymentToOrder' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'PaymentInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'addPaymentToOrder' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Order' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'FragmentSpread',
                        name: { kind: 'Name', value: 'OrderDetailFields' },
                      },
                    ],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'ErrorResult' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'FragmentSpread', name: { kind: 'Name', value: 'ErrorFields' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'AssetFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Asset' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'source' } },
          { kind: 'Field', name: { kind: 'Name', value: 'preview' } },
          { kind: 'Field', name: { kind: 'Name', value: 'width' } },
          { kind: 'Field', name: { kind: 'Name', value: 'height' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mimeType' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrderLineFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'OrderLine' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'quantity' } },
          { kind: 'Field', name: { kind: 'Name', value: 'unitPriceWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'discountedUnitPriceWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'linePriceWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'discountedLinePriceWithTax' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'productVariant' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'sku' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'price' } },
                { kind: 'Field', name: { kind: 'Name', value: 'priceWithTax' } },
                { kind: 'Field', name: { kind: 'Name', value: 'currencyCode' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'product' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'options' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'groupId' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'featuredAsset' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'AssetFields' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrderSummaryFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Order' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'code' } },
          { kind: 'Field', name: { kind: 'Name', value: 'state' } },
          { kind: 'Field', name: { kind: 'Name', value: 'active' } },
          { kind: 'Field', name: { kind: 'Name', value: 'totalQuantity' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currencyCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'subTotal' } },
          { kind: 'Field', name: { kind: 'Name', value: 'subTotalWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'shipping' } },
          { kind: 'Field', name: { kind: 'Name', value: 'shippingWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'total' } },
          { kind: 'Field', name: { kind: 'Name', value: 'totalWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'orderPlacedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'couponCodes' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'lines' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'OrderLineFields' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrderAddressFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'OrderAddress' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'company' } },
          { kind: 'Field', name: { kind: 'Name', value: 'streetLine1' } },
          { kind: 'Field', name: { kind: 'Name', value: 'streetLine2' } },
          { kind: 'Field', name: { kind: 'Name', value: 'city' } },
          { kind: 'Field', name: { kind: 'Name', value: 'province' } },
          { kind: 'Field', name: { kind: 'Name', value: 'postalCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'country' } },
          { kind: 'Field', name: { kind: 'Name', value: 'countryCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'phoneNumber' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrderDetailFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Order' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'FragmentSpread', name: { kind: 'Name', value: 'OrderSummaryFields' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'customer' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'emailAddress' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'shippingAddress' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'OrderAddressFields' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'billingAddress' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'OrderAddressFields' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'shippingLines' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'priceWithTax' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'shippingMethod' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'payments' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'method' } },
                { kind: 'Field', name: { kind: 'Name', value: 'amount' } },
                { kind: 'Field', name: { kind: 'Name', value: 'state' } },
                { kind: 'Field', name: { kind: 'Name', value: 'transactionId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'errorMessage' } },
                { kind: 'Field', name: { kind: 'Name', value: 'metadata' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'discounts' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                { kind: 'Field', name: { kind: 'Name', value: 'amount' } },
                { kind: 'Field', name: { kind: 'Name', value: 'amountWithTax' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ErrorFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ErrorResult' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'errorCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'message' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<AddPaymentToOrderMutation, AddPaymentToOrderMutationVariables>;
export const CollectionListDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'CollectionList' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'options' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'CollectionListOptions' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'collections' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'options' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'options' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'items' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'FragmentSpread',
                        name: { kind: 'Name', value: 'CollectionSummaryFields' },
                      },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'totalItems' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'AssetFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Asset' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'source' } },
          { kind: 'Field', name: { kind: 'Name', value: 'preview' } },
          { kind: 'Field', name: { kind: 'Name', value: 'width' } },
          { kind: 'Field', name: { kind: 'Name', value: 'height' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mimeType' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'CollectionSummaryFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Collection' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          { kind: 'Field', name: { kind: 'Name', value: 'position' } },
          { kind: 'Field', name: { kind: 'Name', value: 'parentId' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'featuredAsset' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'AssetFields' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'breadcrumbs' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CollectionListQuery, CollectionListQueryVariables>;
export const CollectionBySlugDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'CollectionBySlug' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'slug' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'collection' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'slug' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'slug' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'CollectionDetailFields' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'AssetFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Asset' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'source' } },
          { kind: 'Field', name: { kind: 'Name', value: 'preview' } },
          { kind: 'Field', name: { kind: 'Name', value: 'width' } },
          { kind: 'Field', name: { kind: 'Name', value: 'height' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mimeType' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'CollectionSummaryFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Collection' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          { kind: 'Field', name: { kind: 'Name', value: 'position' } },
          { kind: 'Field', name: { kind: 'Name', value: 'parentId' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'featuredAsset' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'AssetFields' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'breadcrumbs' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'CollectionDetailFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Collection' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'FragmentSpread', name: { kind: 'Name', value: 'CollectionSummaryFields' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'productVariantCount' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'children' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'CollectionSummaryFields' },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CollectionBySlugQuery, CollectionBySlugQueryVariables>;
export const CollectionTreeNavDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'CollectionTreeNav' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'collections' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'options' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'topLevelOnly' },
                      value: { kind: 'BooleanValue', value: true },
                    },
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'take' },
                      value: { kind: 'IntValue', value: '50' },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'items' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'FragmentSpread',
                        name: { kind: 'Name', value: 'CollectionSummaryFields' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'children' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'FragmentSpread',
                              name: { kind: 'Name', value: 'CollectionSummaryFields' },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'AssetFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Asset' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'source' } },
          { kind: 'Field', name: { kind: 'Name', value: 'preview' } },
          { kind: 'Field', name: { kind: 'Name', value: 'width' } },
          { kind: 'Field', name: { kind: 'Name', value: 'height' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mimeType' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'CollectionSummaryFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Collection' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          { kind: 'Field', name: { kind: 'Name', value: 'position' } },
          { kind: 'Field', name: { kind: 'Name', value: 'parentId' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'featuredAsset' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'AssetFields' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'breadcrumbs' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CollectionTreeNavQuery, CollectionTreeNavQueryVariables>;
export const ActiveCustomerDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'ActiveCustomer' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'activeCustomer' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'CustomerFields' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'AddressFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Address' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'company' } },
          { kind: 'Field', name: { kind: 'Name', value: 'streetLine1' } },
          { kind: 'Field', name: { kind: 'Name', value: 'streetLine2' } },
          { kind: 'Field', name: { kind: 'Name', value: 'city' } },
          { kind: 'Field', name: { kind: 'Name', value: 'province' } },
          { kind: 'Field', name: { kind: 'Name', value: 'postalCode' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'country' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'phoneNumber' } },
          { kind: 'Field', name: { kind: 'Name', value: 'defaultShippingAddress' } },
          { kind: 'Field', name: { kind: 'Name', value: 'defaultBillingAddress' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'CustomerCustomFieldsFragment' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'CustomerCustomFields' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'marketingOptIn' } },
          { kind: 'Field', name: { kind: 'Name', value: 'marketingOptInAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'preferredActivity' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'CustomerFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Customer' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'title' } },
          { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'emailAddress' } },
          { kind: 'Field', name: { kind: 'Name', value: 'phoneNumber' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'addresses' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'AddressFields' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'customFields' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'CustomerCustomFieldsFragment' },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ActiveCustomerQuery, ActiveCustomerQueryVariables>;
export const LoginDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'Login' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'username' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'password' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'rememberMe' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Boolean' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'login' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'username' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'username' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'password' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'password' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'rememberMe' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'rememberMe' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'CurrentUser' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'FragmentSpread',
                        name: { kind: 'Name', value: 'CurrentUserFields' },
                      },
                    ],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'ErrorResult' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'FragmentSpread', name: { kind: 'Name', value: 'ErrorFields' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'CurrentUserFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'CurrentUser' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'identifier' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'channels' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'token' } },
                { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                { kind: 'Field', name: { kind: 'Name', value: 'permissions' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ErrorFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ErrorResult' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'errorCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'message' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'Logout' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'logout' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'success' } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<LogoutMutation, LogoutMutationVariables>;
export const RegisterCustomerAccountDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'RegisterCustomerAccount' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'RegisterCustomerInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'registerCustomerAccount' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Success' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'success' } }],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'ErrorResult' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'FragmentSpread', name: { kind: 'Name', value: 'ErrorFields' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ErrorFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ErrorResult' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'errorCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'message' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  RegisterCustomerAccountMutation,
  RegisterCustomerAccountMutationVariables
>;
export const VerifyCustomerAccountDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'VerifyCustomerAccount' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'token' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'password' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'verifyCustomerAccount' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'token' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'token' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'password' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'password' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'CurrentUser' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'FragmentSpread',
                        name: { kind: 'Name', value: 'CurrentUserFields' },
                      },
                    ],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'ErrorResult' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'FragmentSpread', name: { kind: 'Name', value: 'ErrorFields' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'CurrentUserFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'CurrentUser' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'identifier' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'channels' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'token' } },
                { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                { kind: 'Field', name: { kind: 'Name', value: 'permissions' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ErrorFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ErrorResult' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'errorCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'message' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<VerifyCustomerAccountMutation, VerifyCustomerAccountMutationVariables>;
export const RequestPasswordResetDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'RequestPasswordReset' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'emailAddress' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'requestPasswordReset' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'emailAddress' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'emailAddress' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Success' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'success' } }],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'ErrorResult' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'FragmentSpread', name: { kind: 'Name', value: 'ErrorFields' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ErrorFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ErrorResult' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'errorCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'message' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<RequestPasswordResetMutation, RequestPasswordResetMutationVariables>;
export const ResetPasswordDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'ResetPassword' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'token' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'password' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'resetPassword' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'token' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'token' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'password' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'password' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'CurrentUser' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'FragmentSpread',
                        name: { kind: 'Name', value: 'CurrentUserFields' },
                      },
                    ],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'ErrorResult' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'FragmentSpread', name: { kind: 'Name', value: 'ErrorFields' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'CurrentUserFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'CurrentUser' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'identifier' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'channels' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'token' } },
                { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                { kind: 'Field', name: { kind: 'Name', value: 'permissions' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ErrorFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ErrorResult' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'errorCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'message' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ResetPasswordMutation, ResetPasswordMutationVariables>;
export const UpdateCustomerDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateCustomer' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'UpdateCustomerInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateCustomer' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'CustomerFields' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'AddressFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Address' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'company' } },
          { kind: 'Field', name: { kind: 'Name', value: 'streetLine1' } },
          { kind: 'Field', name: { kind: 'Name', value: 'streetLine2' } },
          { kind: 'Field', name: { kind: 'Name', value: 'city' } },
          { kind: 'Field', name: { kind: 'Name', value: 'province' } },
          { kind: 'Field', name: { kind: 'Name', value: 'postalCode' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'country' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'phoneNumber' } },
          { kind: 'Field', name: { kind: 'Name', value: 'defaultShippingAddress' } },
          { kind: 'Field', name: { kind: 'Name', value: 'defaultBillingAddress' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'CustomerCustomFieldsFragment' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'CustomerCustomFields' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'marketingOptIn' } },
          { kind: 'Field', name: { kind: 'Name', value: 'marketingOptInAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'preferredActivity' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'CustomerFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Customer' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'title' } },
          { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'emailAddress' } },
          { kind: 'Field', name: { kind: 'Name', value: 'phoneNumber' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'addresses' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'AddressFields' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'customFields' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'CustomerCustomFieldsFragment' },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateCustomerMutation, UpdateCustomerMutationVariables>;
export const UpdateCustomerPasswordDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateCustomerPassword' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'currentPassword' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'newPassword' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateCustomerPassword' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'currentPassword' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'currentPassword' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'newPassword' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'newPassword' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Success' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'success' } }],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'ErrorResult' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'FragmentSpread', name: { kind: 'Name', value: 'ErrorFields' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ErrorFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ErrorResult' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'errorCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'message' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdateCustomerPasswordMutation,
  UpdateCustomerPasswordMutationVariables
>;
export const RequestUpdateCustomerEmailAddressDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'RequestUpdateCustomerEmailAddress' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'password' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'newEmailAddress' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'requestUpdateCustomerEmailAddress' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'password' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'password' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'newEmailAddress' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'newEmailAddress' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Success' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'success' } }],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'ErrorResult' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'FragmentSpread', name: { kind: 'Name', value: 'ErrorFields' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ErrorFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ErrorResult' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'errorCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'message' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  RequestUpdateCustomerEmailAddressMutation,
  RequestUpdateCustomerEmailAddressMutationVariables
>;
export const UpdateCustomerEmailAddressDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateCustomerEmailAddress' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'token' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateCustomerEmailAddress' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'token' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'token' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Success' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'success' } }],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'ErrorResult' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'FragmentSpread', name: { kind: 'Name', value: 'ErrorFields' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ErrorFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ErrorResult' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'errorCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'message' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdateCustomerEmailAddressMutation,
  UpdateCustomerEmailAddressMutationVariables
>;
export const ActiveOrderDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'ActiveOrder' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'activeOrder' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'OrderDetailFields' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'AssetFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Asset' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'source' } },
          { kind: 'Field', name: { kind: 'Name', value: 'preview' } },
          { kind: 'Field', name: { kind: 'Name', value: 'width' } },
          { kind: 'Field', name: { kind: 'Name', value: 'height' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mimeType' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrderLineFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'OrderLine' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'quantity' } },
          { kind: 'Field', name: { kind: 'Name', value: 'unitPriceWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'discountedUnitPriceWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'linePriceWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'discountedLinePriceWithTax' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'productVariant' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'sku' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'price' } },
                { kind: 'Field', name: { kind: 'Name', value: 'priceWithTax' } },
                { kind: 'Field', name: { kind: 'Name', value: 'currencyCode' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'product' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'options' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'groupId' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'featuredAsset' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'AssetFields' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrderSummaryFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Order' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'code' } },
          { kind: 'Field', name: { kind: 'Name', value: 'state' } },
          { kind: 'Field', name: { kind: 'Name', value: 'active' } },
          { kind: 'Field', name: { kind: 'Name', value: 'totalQuantity' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currencyCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'subTotal' } },
          { kind: 'Field', name: { kind: 'Name', value: 'subTotalWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'shipping' } },
          { kind: 'Field', name: { kind: 'Name', value: 'shippingWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'total' } },
          { kind: 'Field', name: { kind: 'Name', value: 'totalWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'orderPlacedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'couponCodes' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'lines' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'OrderLineFields' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrderAddressFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'OrderAddress' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'company' } },
          { kind: 'Field', name: { kind: 'Name', value: 'streetLine1' } },
          { kind: 'Field', name: { kind: 'Name', value: 'streetLine2' } },
          { kind: 'Field', name: { kind: 'Name', value: 'city' } },
          { kind: 'Field', name: { kind: 'Name', value: 'province' } },
          { kind: 'Field', name: { kind: 'Name', value: 'postalCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'country' } },
          { kind: 'Field', name: { kind: 'Name', value: 'countryCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'phoneNumber' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrderDetailFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Order' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'FragmentSpread', name: { kind: 'Name', value: 'OrderSummaryFields' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'customer' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'emailAddress' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'shippingAddress' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'OrderAddressFields' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'billingAddress' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'OrderAddressFields' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'shippingLines' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'priceWithTax' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'shippingMethod' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'payments' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'method' } },
                { kind: 'Field', name: { kind: 'Name', value: 'amount' } },
                { kind: 'Field', name: { kind: 'Name', value: 'state' } },
                { kind: 'Field', name: { kind: 'Name', value: 'transactionId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'errorMessage' } },
                { kind: 'Field', name: { kind: 'Name', value: 'metadata' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'discounts' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                { kind: 'Field', name: { kind: 'Name', value: 'amount' } },
                { kind: 'Field', name: { kind: 'Name', value: 'amountWithTax' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ActiveOrderQuery, ActiveOrderQueryVariables>;
export const ActiveCustomerOrdersDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'ActiveCustomerOrders' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'options' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'OrderListOptions' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'activeCustomer' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'orders' },
                  arguments: [
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'options' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'options' } },
                    },
                  ],
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'items' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'FragmentSpread',
                              name: { kind: 'Name', value: 'OrderSummaryFields' },
                            },
                          ],
                        },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'totalItems' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'AssetFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Asset' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'source' } },
          { kind: 'Field', name: { kind: 'Name', value: 'preview' } },
          { kind: 'Field', name: { kind: 'Name', value: 'width' } },
          { kind: 'Field', name: { kind: 'Name', value: 'height' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mimeType' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrderLineFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'OrderLine' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'quantity' } },
          { kind: 'Field', name: { kind: 'Name', value: 'unitPriceWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'discountedUnitPriceWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'linePriceWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'discountedLinePriceWithTax' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'productVariant' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'sku' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'price' } },
                { kind: 'Field', name: { kind: 'Name', value: 'priceWithTax' } },
                { kind: 'Field', name: { kind: 'Name', value: 'currencyCode' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'product' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'options' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'groupId' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'featuredAsset' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'AssetFields' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrderSummaryFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Order' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'code' } },
          { kind: 'Field', name: { kind: 'Name', value: 'state' } },
          { kind: 'Field', name: { kind: 'Name', value: 'active' } },
          { kind: 'Field', name: { kind: 'Name', value: 'totalQuantity' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currencyCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'subTotal' } },
          { kind: 'Field', name: { kind: 'Name', value: 'subTotalWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'shipping' } },
          { kind: 'Field', name: { kind: 'Name', value: 'shippingWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'total' } },
          { kind: 'Field', name: { kind: 'Name', value: 'totalWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'orderPlacedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'couponCodes' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'lines' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'OrderLineFields' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ActiveCustomerOrdersQuery, ActiveCustomerOrdersQueryVariables>;
export const OrderByCodeDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'OrderByCode' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'code' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'orderByCode' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'code' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'code' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'OrderDetailFields' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'AssetFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Asset' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'source' } },
          { kind: 'Field', name: { kind: 'Name', value: 'preview' } },
          { kind: 'Field', name: { kind: 'Name', value: 'width' } },
          { kind: 'Field', name: { kind: 'Name', value: 'height' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mimeType' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrderLineFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'OrderLine' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'quantity' } },
          { kind: 'Field', name: { kind: 'Name', value: 'unitPriceWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'discountedUnitPriceWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'linePriceWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'discountedLinePriceWithTax' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'productVariant' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'sku' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'price' } },
                { kind: 'Field', name: { kind: 'Name', value: 'priceWithTax' } },
                { kind: 'Field', name: { kind: 'Name', value: 'currencyCode' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'product' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'options' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'groupId' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'featuredAsset' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'AssetFields' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrderSummaryFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Order' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'code' } },
          { kind: 'Field', name: { kind: 'Name', value: 'state' } },
          { kind: 'Field', name: { kind: 'Name', value: 'active' } },
          { kind: 'Field', name: { kind: 'Name', value: 'totalQuantity' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currencyCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'subTotal' } },
          { kind: 'Field', name: { kind: 'Name', value: 'subTotalWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'shipping' } },
          { kind: 'Field', name: { kind: 'Name', value: 'shippingWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'total' } },
          { kind: 'Field', name: { kind: 'Name', value: 'totalWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'orderPlacedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'couponCodes' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'lines' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'OrderLineFields' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrderAddressFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'OrderAddress' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'company' } },
          { kind: 'Field', name: { kind: 'Name', value: 'streetLine1' } },
          { kind: 'Field', name: { kind: 'Name', value: 'streetLine2' } },
          { kind: 'Field', name: { kind: 'Name', value: 'city' } },
          { kind: 'Field', name: { kind: 'Name', value: 'province' } },
          { kind: 'Field', name: { kind: 'Name', value: 'postalCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'country' } },
          { kind: 'Field', name: { kind: 'Name', value: 'countryCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'phoneNumber' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrderDetailFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Order' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'FragmentSpread', name: { kind: 'Name', value: 'OrderSummaryFields' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'customer' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'emailAddress' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'shippingAddress' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'OrderAddressFields' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'billingAddress' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'OrderAddressFields' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'shippingLines' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'priceWithTax' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'shippingMethod' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'payments' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'method' } },
                { kind: 'Field', name: { kind: 'Name', value: 'amount' } },
                { kind: 'Field', name: { kind: 'Name', value: 'state' } },
                { kind: 'Field', name: { kind: 'Name', value: 'transactionId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'errorMessage' } },
                { kind: 'Field', name: { kind: 'Name', value: 'metadata' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'discounts' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                { kind: 'Field', name: { kind: 'Name', value: 'amount' } },
                { kind: 'Field', name: { kind: 'Name', value: 'amountWithTax' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<OrderByCodeQuery, OrderByCodeQueryVariables>;
export const ProductListDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'ProductList' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'options' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'ProductListOptions' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'products' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'options' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'options' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'items' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'FragmentSpread',
                        name: { kind: 'Name', value: 'ProductCardFields' },
                      },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'totalItems' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'AssetFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Asset' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'source' } },
          { kind: 'Field', name: { kind: 'Name', value: 'preview' } },
          { kind: 'Field', name: { kind: 'Name', value: 'width' } },
          { kind: 'Field', name: { kind: 'Name', value: 'height' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mimeType' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ProductCardFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Product' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'featuredAsset' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'AssetFields' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'variantList' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'options' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'take' },
                      value: { kind: 'IntValue', value: '1' },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'items' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'sku' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'price' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'priceWithTax' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'currencyCode' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'customFields' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'activity' } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ProductListQuery, ProductListQueryVariables>;
export const ProductBySlugDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'ProductBySlug' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'slug' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'product' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'slug' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'slug' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'ProductDetailFields' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'AssetFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Asset' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'source' } },
          { kind: 'Field', name: { kind: 'Name', value: 'preview' } },
          { kind: 'Field', name: { kind: 'Name', value: 'width' } },
          { kind: 'Field', name: { kind: 'Name', value: 'height' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mimeType' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ProductDetailVariantFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ProductVariant' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'sku' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'price' } },
          { kind: 'Field', name: { kind: 'Name', value: 'priceWithTax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currencyCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'stockLevel' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'featuredAsset' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'AssetFields' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'assets' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'AssetFields' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'options' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'groupId' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ProductCustomFieldsFragment' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ProductCustomFields' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'activity' } },
          { kind: 'Field', name: { kind: 'Name', value: 'materialComposition' } },
          { kind: 'Field', name: { kind: 'Name', value: 'careInstructions' } },
          { kind: 'Field', name: { kind: 'Name', value: 'sustainabilityNotes' } },
          { kind: 'Field', name: { kind: 'Name', value: 'manufacturerInfo' } },
          { kind: 'Field', name: { kind: 'Name', value: 'warnings' } },
          { kind: 'Field', name: { kind: 'Name', value: 'traceabilityCode' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'responsiblePerson' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                { kind: 'Field', name: { kind: 'Name', value: 'address' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ProductDetailFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Product' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'featuredAsset' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'AssetFields' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'assets' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'AssetFields' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'collections' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'breadcrumbs' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'optionGroups' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'options' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'variants' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'ProductDetailVariantFields' },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'customFields' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'ProductCustomFieldsFragment' },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ProductBySlugQuery, ProductBySlugQueryVariables>;
export const SearchProductsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'SearchProducts' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'SearchInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'search' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'totalItems' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'items' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'FragmentSpread',
                        name: { kind: 'Name', value: 'SearchResultFields' },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'facetValues' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'FragmentSpread',
                        name: { kind: 'Name', value: 'SearchFacetValueResultFields' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'SearchResultFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'SearchResult' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'productId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'productName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'productAsset' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'preview' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'focalPoint' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'x' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'y' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'priceWithTax' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'SinglePrice' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'value' } }],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'PriceRange' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'min' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'max' } },
                    ],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'currencyCode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'collectionIds' } },
          { kind: 'Field', name: { kind: 'Name', value: 'facetValueIds' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'SearchFacetValueResultFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'FacetValueResult' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'count' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'facetValue' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'facet' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<SearchProductsQuery, SearchProductsQueryVariables>;
