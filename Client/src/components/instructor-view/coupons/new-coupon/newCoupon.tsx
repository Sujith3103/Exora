import { Button } from "@/components/ui/button"
import { DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Controller, useForm } from "react-hook-form"
import { SelectOneCourse } from "./oneCourse"
import { LucideMoveRight, X } from "lucide-react"
import { toast } from "sonner"
import useCouponMutation from "@/hooks/mutations/useCouponMutation"

type NewCouponprop = {

  isScheduling: boolean

}

export type couponForm = {
  title: string,
  code: string,
  discountType: "percentage" | "fixed",
  discount: number,
  noOfCoupons: number,
  limitPerUser: number,
  onlyFor: 'tier_3' | 'tier_1' | 'tier_2',
  autoApply: boolean,
  validUntil: Date,
  validFrom: Date,
  applyTo: 'oneCourse' | 'allCourses',
  courseId?: string
}

const NewCoupon = ({ isScheduling }: NewCouponprop) => {

  const { addNewCoupon } = useCouponMutation()

  const { control, handleSubmit, watch, register, formState: { errors } } = useForm<couponForm>({
    defaultValues: {
      applyTo: 'allCourses',
      discountType: 'percentage',
      autoApply: true,
      onlyFor: 'tier_3',
      courseId: ''
    }
  })

  const applyTo = watch("applyTo")
  // const discount = watch('discount')
  const discountType = watch('discountType')

  const checkValidDates = (data: couponForm): boolean => {
    console.log("checking valid dates");
    const now = new Date();

    // Coupon should always expire in the future
    if (new Date(data.validUntil).getTime() <= now.getTime()) {
      return false;
    }

    if (isScheduling) {
      // Scheduled coupons must start in the future
      if (new Date(data.validFrom).getTime() < now.getTime()) {
        return false;
      }
      // validUntil must also be after validFrom
      if (new Date(data.validUntil).getTime() <= new Date(data.validFrom).getTime()) {
        return false;
      }
    }

    return true;
  };

  const onSubmit = (data: couponForm) => {
    const isValidDates = checkValidDates(data);

    if (!isValidDates) {
      return toast.error('enter a valid date', { style: { justifyContent: 'center' }, duration: 2000 })
    }
    console.log(data)
    addNewCoupon.mutate(data)

  };

  return (

    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="w-full flex flex-col gap-5">

        {/* title and coupon code */}
        <div className="flex flex-col gap-1">
          <Label>Title</Label>
          <Input {...register("title", { required: 'title is required', maxLength: { value: 30, message: 'the title should be no more then 30 characters' } })} placeholder="Coupon Title" />
          {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
          <p className="text-sm text-muted-foreground italic">*keep your title short and concise* only you can see it</p>
        </div>
        <div className="space-y-1">
          <Label>Coupon Code</Label>
          <Input {...register('code', {
            required: 'coupon code is required', maxLength: { value: 20, message: 'coupon code should be no more then 20 characters' },
            pattern: {
              value: /^\S+$/, // \S means "non-whitespace", so ^\S+$ = no spaces allowed
              message: "No spaces allowed in the title"
            }
          })} className="" placeholder="eg.FIRST50" />
          {errors.code && <p className="text-sm text-red-500">{errors.code.message}</p>}
          <p className="text-sm text-muted-foreground italic">*keep your coupon code short, concise and more meaningful*</p>
        </div>

        {/* discount */}
        <div className="sm:flex space-y-2">
          <div className="w-full space-y-2">
            <Label>Discount Type</Label>
            <Controller
              name="discountType"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select discount type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="sm:w-full w-[180px] space-y-2">
            <Label>Discount</Label>
            <Input type="number" {...register('discount', {
              required: 'discount is required',
              validate: (val) => {
                if (discountType === "percentage") {
                  if (val < 10 || val > 80) {
                    return "Percentage must be between 10 and 80"
                  }
                }
                if (discountType === "fixed") {
                  if (val < 50 || val > 4000) {
                    return "Fixed discount must be between 50 and 4000"
                  }
                }
                return true
              },
            })} />
            {errors.discount && (
              <p className="text-sm text-red-500">{errors.discount.message}</p>
            )}
          </div>
        </div>

        {/* no of coupons and limits */}
        <div className="flex sm:flex-row flex-col w-full sm:gap-0 gap-7 pb-3">
          <div className="w-[180px] h-[36px] sm:mr-13 space-y-2">
            <Label>No of Coupons</Label>
            <Input {...register('noOfCoupons', { min: { value: 50, message: 'must be atleast 50' }, required: 'no of coupons are required' })} />
            {errors.noOfCoupons && (
              <p className="text-sm text-red-500">{errors.noOfCoupons.message}</p>
            )}
          </div>
          <div className="sm:flex-1 space-y-2 w-[18px]">
            <Label>Limit per User</Label>
            <Input {...register('limitPerUser', { required: 'limit per user is required', min: { value: 1, message: 'atleast 1' } })} />
            {errors.limitPerUser && (
              <p className="text-sm text-red-500">{errors.limitPerUser.message}</p>
            )}
          </div>
        </div>

        {/* only for */}
        <div className="flex sm:flex-row flex-col sm:gap-0 gap-3">
          <div className="w-1/2 space-y-2">
            <Label>Only for</Label>
            <Controller
              name="onlyFor"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Coupons only for" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Only for</SelectLabel>
                      <SelectItem value="tier_1">Tier 1 – New Users</SelectItem>
                      <SelectItem value="tier_2">Tier 2 – Loyal Customers</SelectItem>
                      <SelectItem value="tier_3">Everyone</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )
              }
            />
          </div>
          {/* auto apply */}
          <div className="sm:w-1/2 w-[180px] space-y-2">
            <Label>Auto Apply</Label>
            <Controller
              name="autoApply"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={(val) => field.onChange(val === "true")} // string → boolean
                  value={field.value ? "true" : "false"} // boolean → string
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Applies automatically" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>
                        Applies when user views your course automatically
                      </SelectLabel>
                      <SelectItem value="true">true</SelectItem>
                      <SelectItem value="false">false</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        {/* all courses or one course */}
        <div className="flex sm:flex-row flex-col sm:items-center">

          <div className="mb-1">
            <Label>Apply to</Label>
            <div className=" w-[180px] space-y-2 ">
              <Controller
                name="applyTo"
                control={control}
                render={({ field }) =>
                  <Select onValueChange={field.onChange} defaultValue={field.value} required>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="apply to" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="oneCourse">One Course only</SelectItem>
                        <SelectItem value="allCourses">All Courses</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                }
              />
            </div>
          </div>

          {/* specifc course */}
          {applyTo === 'oneCourse' &&
            <>
              <LucideMoveRight className="ml-3" />
              <div className="w-[223px] ml-auto">
                <Controller
                  name="courseId"
                  control={control}
                  rules={{ required: "Please select a course" }}
                  render={({ field }) => (
                    <>
                      <SelectOneCourse
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </>
                  )}
                />
              </div>
            </>
          }
        </div>
        <div className="flex w-full">


          <div className="space-y-2 w-[180px]">
            <Label>Valid Until</Label>
            <Input type="datetime-local" {...register('validUntil', { required: 'valid until is required' })} />
            {errors.validUntil && (
              <p className="text-sm text-red-500">{errors.validUntil.message}</p>
            )}
          </div>
          {
            isScheduling &&
            <div className="space-y-2 w-[231px] ml-auto">
              <Label>Valid from</Label>
              <Input type="datetime-local" {...register('validFrom', { required: 'valid from is required' })} />
              {errors.validFrom && (
                <p className="text-sm text-red-500">{errors.validFrom.message}</p>
              )}
            </div>
          }
        </div>
        <hr className="border-gray-400" />
        <div className="flex ">
          <DialogClose asChild>
            <Button variant="outline" className="w-40 border-red-300">Cancel</Button>
          </DialogClose>
          <Button type="submit" className="w-40 ml-auto">Submit</Button>
        </div>
      </div>
    </form>
  )
}

export default NewCoupon
