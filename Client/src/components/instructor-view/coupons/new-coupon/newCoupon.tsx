import { Button } from "@/components/ui/button"
import { DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Controller, useForm } from "react-hook-form"
import { SelectOneCourse } from "./oneCourse"
import { LucideMoveRight } from "lucide-react"

type NewCouponprop = {

  isScheduling: boolean

}

type couponForm = {
  title: string,
  code: string,
  discountType: "percentage" | "fixed",
  discount: number,
  noOfCoupons: number,
  limitPerUser: number,
  onlyFor: string,
  autoApply: boolean,
  validUntil: Date,
  applyTo: 'one_course' | 'all_courses',
  courseId?: string
}

const NewCoupon = ({ isScheduling }: NewCouponprop) => {

  const { control, handleSubmit, watch, register, formState: { errors } } = useForm<couponForm>({
    defaultValues: {
      applyTo: 'all_courses',
      discountType: 'percentage',
      autoApply: true,
      courseId: ''
    }
  })

  const applyTo = watch("applyTo")
  // const discount = watch('discount')
  const discountType = watch('discountType')

  const onSubmit = (data: couponForm) => {
    console.log("Form submitted:", data)
  }

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
        <div className="flex sm:flex-row flex-col w-full justify-between sm:gap-0 gap-7">
          <div className="w-[180px] h-[36px] sm:mr-13 space-y-2">
            <Label>No of Coupons</Label>
            <Input {...register('noOfCoupons', { min: { value: 50, message: 'must be atleast 50' } })} />
          </div>
          <div className="sm:flex-1 space-y-2 w-[18px]">
            <Label>Limit per User</Label>
            <Input {...register('limitPerUser', { required: true, min: { value: 1, message: 'atleast 1' } })} />
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
          <div className=" w-[180px] ">
            <Controller
              name="applyTo"
              control={control}
              render={({ field }) =>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="apply to" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="one_course">One Course only</SelectItem>
                      <SelectItem value="all_courses">All Courses</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              }
            />
          </div>

          {/* specifc course */}
          {applyTo === 'one_course' &&
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
            <Label>Valid From</Label>
            <Input type="date" />
          </div>
          {
            isScheduling &&
            <div className="space-y-2 w-[231px] ml-auto">
              <Label>Valid Until</Label>
              <Input type="date" />
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
