import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CalculatorService {

  private operand: string[];
  private operator: string;
  private op: number;
  private max_len: number;
  private is_error: boolean;
  private source: BehaviorSubject<string>;

  constructor() {
    this.source = new BehaviorSubject<string>('0');
    this.reset();
  }

  setMaxLength(l: number) {
    this.max_len = l;
  }

  private emitChanges() {
    this.source.next(this.operand[this.op]);
  }

  operationChanges(): Observable<any> {
    return this.source.asObservable();
  }

  value(): string {
    return this.operand[this.op];
  }

  input(v: string) {
    if (this.is_error) {
      return;
    }
    if ('' !== this.operator && 0 === this.op) {
      this.op = 1;
    }
    if (this.is_digit(v)) {
      if ('0' === this.operand[this.op]) {
        this.operand[this.op] = v;
      } else {
        this.operand[this.op] += v;
      }

      if (this.max_len > 0 && this.operand[this.op].length > this.max_len) {
        this.raise('overflow');
      }
    }
    this.emitChanges();
  }

  raise(msg: string) {
    this.reset();
    this.operand[0] = msg;
    this.is_error = true;
    this.emitChanges();
  }

  is_digit(v: string) {
    return (v.length === 1) && ('1234567890'.indexOf(v) >= 0);
  }

  reset() {
    this.operand = ['0', '0'];
    this.operator = '';
    this.op = 0;
    this.is_error = false;
    this.emitChanges();
  }

  add() {
    this.operator = '+';
    this.emitChanges();
  }

  subtract() {
    this.operator = '-';
    this.emitChanges();
  }

  multiply() {
    this.operator = '*';
    this.emitChanges();
  }

  divide() {
    this.operator = '/';
    this.emitChanges();
  }

  solve() {
    var result = '';
    if ('/' === this.operator && '0' === this.operand[1]) {
      this.raise('div-by-0');
      return;
    } else {
      result = eval(`${this.operand[0]}${this.operator}${this.operand[1]}`).toString();
      if (this.max_len > 0 && result.length > this.max_len) {
        this.raise('overflow');
        return;
      }
      this.reset();
    }
    this.operand[0] = result;
    this.emitChanges();
  }
}
