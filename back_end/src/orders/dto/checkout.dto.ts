import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsArray,
  IsInt,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

// One line in the cart: which product, how many
export class CheckoutItemDto {
  @IsInt()
  @Min(1)
  productId: number;

  @IsInt()
  @Min(1)
  @Max(1000)
  quantity: number;
}

// Body of POST /checkout
// Example: { "items": [ { "productId": 1, "quantity": 2 } ] }
// NOTE: the client sends NO prices — the server reads prices from the DB.
export class CheckoutDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(100)
  @ValidateNested({ each: true })
  @Type(() => CheckoutItemDto)
  items: CheckoutItemDto[];
}
