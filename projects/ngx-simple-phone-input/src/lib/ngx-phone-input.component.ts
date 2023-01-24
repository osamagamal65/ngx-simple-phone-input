import { Country } from '../models/country';
import * as lpn from 'google-libphonenumber';

import {
	Component,
	ElementRef,
	EventEmitter,
	forwardRef,
	Input,
	OnChanges,
	OnInit,
	Output,
	SimpleChanges,
	ViewChild,
} from '@angular/core';
import { countries } from '../data/countries';

@Component({
  selector: 'ngx-simple-phone-input',
  templateUrl: "./ngx-phone-input.component.html",
  styleUrls: ["./ngx-phone-input.component.scss"]
})
export class NgxPhoneInputComponent implements OnInit {
  	@Input() value: string | undefined = '';
	@Input() preferredCountries: Array<string> = [];
	@Input() enablePlaceholder = true;
	@Input() customPlaceholder?: string;
	@Input() cssClass = '';
	@Input() onlyCountries: Array<string> = [];
	@Input() enableAutoCountrySelect = true;
	@Input() searchCountryFlag = false;
	@Input() maxLength?: number = 16;
	@Input() selectFirstCountry = true;
	@Input() selectedCountryISO?: string;
	@Input() phoneValidation = true;
  	@Input() disabled = false;
	@Input() inputId = 'phone';


	@Output() readonly countryChange = new EventEmitter<Country>();
	@Output() readonly valueChange = new EventEmitter<string>();

  allCountries: Country[] = countries;
  isOpen: boolean = false;
  selectedCountry: Country;
  phoneNumber: string | undefined = '';
  countrySearchText = '';
	phoneUtil: any = lpn.PhoneNumberUtil.getInstance();

  onTouched = () => {}

	propagateChange = (_: any) => {};

  constructor() {
   this.selectedCountry = countries[0];
  }

  ngOnInit(): void {}

  getFlagImageUrlFromCountryCode(code?: string): string{
    return `https://flagcdn.com/${code?.toLowerCase()}.svg`;
  }

  handleCountryImageFail(event: Event, flagText: string) {
    (event.target as HTMLElement).innerHTML = flagText;
  }
  toggleDropdown() {
      this.isOpen = !this.isOpen;
  }


	setSelectedCountry(country: Country) {
		this.selectedCountry = country;
		this.countryChange.emit(country);
	}


	public onCountrySelect(country: Country, el: HTMLInputElement): void {

		this.setSelectedCountry(country);
    	this.isOpen = false;

		if (this.phoneNumber && this.phoneNumber.length > 0) {
			this.value = this.phoneNumber;
			const number = this.getParsedNumber(
				this.phoneNumber,
				this.selectedCountry.code
			);
			const intlNo = number
				? this.phoneUtil.format(number, lpn.PhoneNumberFormat.INTERNATIONAL)
				: '';


			this.propagateChange({
				number: this.value,
				internationalNumber: intlNo,
				nationalNumber: number
					? this.phoneUtil.format(number, lpn.PhoneNumberFormat.NATIONAL)
					: '',
				e164Number: number
					? this.phoneUtil.format(number, lpn.PhoneNumberFormat.E164)
					: '',
				countryCode: this.selectedCountry.code.toUpperCase(),
				dialCode:  this.selectedCountry.dialCode,
			});
		} else {
      this.propagateChange(null);
		}
    el.value =  this.selectedCountry.dialCode;
		el.focus();
	}


  onInputKeyPress(event: KeyboardEvent){
		const allowedChars = /[0-9\+\-\(\)\ ]/;
		const allowedCtrlChars = /[axcv]/; // Allows copy-pasting
		const allowedOtherKeys = [
			'ArrowLeft',
			'ArrowUp',
			'ArrowRight',
			'ArrowDown',
			'Home',
			'End',
			'Insert',
			'Delete',
			'Backspace',
		];

		if (
			!allowedChars.test(event.key) &&
			!(event.ctrlKey && allowedCtrlChars.test(event.key)) &&
			!allowedOtherKeys.includes(event.key)
		) {
			event.preventDefault();
		}
  }
  public onPhoneNumberChange(): void {
		let countryCode: string | undefined;

		// Handle the case where the user sets the value programatically based on a persisted ChangeData obj.
		if (this.phoneNumber && typeof this.phoneNumber === 'object') {
			const numberObj: any = this.phoneNumber;
			this.phoneNumber = numberObj.number;
			countryCode = numberObj.countryCode;
		}

		this.value = this.phoneNumber;

		countryCode = countryCode || this.selectedCountry.code;
		// @ts-ignore
    const number = this.getParsedNumber(this.phoneNumber, countryCode);

		// auto select country based on the extension (and areaCode if needed) (e.g select Canada if number starts with +1 416)
		if (this.enableAutoCountrySelect) {

      countryCode =
				number && number.getCountryCode()
          // @ts-ignore
					? this.getCountryIsoCode(number.getCountryCode(), number)
					: this.selectedCountry.code;
			if (countryCode && countryCode !== this.selectedCountry.dialCode) {
				const newCountry = this.allCountries
					.find((c) => c.code === countryCode || c.dialCode === countryCode);
				if (newCountry) {
					this.selectedCountry = newCountry;
          this.countryChange.emit(this.selectedCountry);
				}
			}
		}
		countryCode = countryCode ? countryCode : this.selectedCountry.code;


		if (!this.value) {
			// Reason: avoid https://stackoverflow.com/a/54358133/1617590
			// tslint:disable-next-line: no-null-keyword
			// @ts-ignore
        this.propagateChange(null);
		} else {
			const intlNo = number
				? this.phoneUtil.format(number, lpn.PhoneNumberFormat.INTERNATIONAL)
				: '';
			this.propagateChange({
				number: this.value,
				internationalNumber: intlNo,
				nationalNumber: number
					? this.phoneUtil.format(number, lpn.PhoneNumberFormat.NATIONAL)
					: '',
				e164Number: number
					? this.phoneUtil.format(number, lpn.PhoneNumberFormat.E164)
					: '',
				countryCode: countryCode.toUpperCase(),
				dialCode: '+' + this.selectedCountry.dialCode,
			});
      this.phoneNumber = intlNo;
			this.valueChange.emit(intlNo);
		}
	}



	resolvePlaceholder(): string {
		let placeholder = '';
		if (this.customPlaceholder) {
			placeholder = this.customPlaceholder;
		} else if (this.selectedCountry.placeHolder) {
			placeholder = this.selectedCountry.placeHolder;
		}
		return placeholder;
	}



  	/**
	 * Search country based on country name, code, dialCode or all of them.
	 */
	public searchCountry() {}




	/* --------------------------------- Helpers -------------------------------- */
	/**
	 * Returns parse PhoneNumber object.
	 * @param phoneNumber string
	 * @param countryCode string
	 */
	private getParsedNumber(
		phoneNumber: string,
		countryCode: string
	): lpn.PhoneNumber {
		let number: lpn.PhoneNumber;
		try {
			number = this.phoneUtil.parse(phoneNumber, countryCode.toUpperCase());
		} catch (e) {}
		// @ts-ignore
    return number;
	}


	/**
	 * Sifts through all countries and returns iso code of the primary country
	 * based on the number provided.
	 * @param countryCode country code in number format
	 * @param number PhoneNumber object
	 */
	private getCountryIsoCode(
		countryCode: number,
		number: lpn.PhoneNumber
	): string | undefined {
		// Will use this to match area code from the first numbers
		// @ts-ignore
    const rawNumber = number['values_']['2'].toString();
		// List of all countries with countryCode (can be more than one. e.x. US, CA, DO, PR all have +1 countryCode)
		const countries = this.allCountries.filter(
			(c) => c.dialCode === countryCode.toString() || c.code.toLowerCase() === countryCode.toString()
		);
		// Main country is the country, which has no areaCodes specified in country-code.ts file.
		const mainCountry = countries.find((c) => c.areaCodes === undefined);
		// Secondary countries are all countries, which have areaCodes specified in country-code.ts file.
		const secondaryCountries = countries.filter(
			(c) => c.areaCodes !== undefined
		);
		let matchedCountry = mainCountry ? mainCountry.code : undefined;

		/*
			Iterate over each secondary country and check if nationalNumber starts with any of areaCodes available.
			If no matches found, fallback to the main country.
		*/
		secondaryCountries.forEach((country) => {
			// @ts-ignore
      country.areaCodes.forEach((areaCode) => {
				if (rawNumber.startsWith(areaCode)) {
					matchedCountry = country.code;
				}
			});
		});

		return matchedCountry;
	}

	/**
	 * Gets formatted example phone number from phoneUtil.
	 * @param countryCode string
	 */
	protected getPhoneNumberPlaceHolder(countryCode: string): string {
		try {
			return this.phoneUtil.format(
				this.phoneUtil.getExampleNumber(countryCode),
				lpn.PhoneNumberFormat['INTERNATIONAL']
			);
		} catch (e) {
			// @ts-ignore
      return e;
		}
	}



  private updateSelectedCountry() {
		if (this.selectedCountryISO) {
			// @ts-ignore
      this.selectedCountry = this.allCountries.find((c) => {
				return c.iso.toLowerCase() === this.selectedCountryISO?.toLowerCase();
			});
			if (this.selectedCountry) {
				if (this.phoneNumber) {
					this.onPhoneNumberChange();
				} else {
					// Reason: avoid https://stackoverflow.com/a/54358133/1617590
					// tslint:disable-next-line: no-null-keyword
					// @ts-ignore
          this.propagateChange(null);
				}
			}
		}
	}
}
