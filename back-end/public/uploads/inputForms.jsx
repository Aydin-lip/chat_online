import React, { useContext, useState } from 'react';
import AddTreeDataContext from '../../context/AddTreeDataProvider';
import MainDataContext from '../../context/mainDataProvider';

const InputForm = ({
  setValue,
  inputData,
  register,
  name,
  caption,
  type,
  errors,
  basicCodeData,
  usage,
}) => {
  const { singleData } = useContext(AddTreeDataContext);
  const { mainData } = useContext(MainDataContext);
  const [checked, setChecked] = useState(true);

  ////////////////////////////////////if usage = Add New Data ////////
  if (usage === 'addNewData' || usage === 'addSubData') {
    if (name === 'code_Parent_Mc' && usage === 'addNewData') {
      setValue('code_Parent_Mc', 0);
      return (
        <div className=' bg-warning  text-secondary '>
          <div className='input-group'>
            <input
              id={name}
              className='w-100 form-control'
              type='hidden'
              {...register}
            />
          </div>
        </div>
      );
    }

    if (name === 'level_Mc' && usage === 'addNewData') {
      setValue('level_Mc', 0);

      return (
        <div className='row text-secondary  '>
          <div className='input-group'>
            <input
              id={name}
              className='form-control '
              type='hidden'
              value='0'
              disabled
            />
          </div>
        </div>
      );
    }

    if (
      name === 'code_Mc' ||
      name === 'pakna_Code' ||
      name === 'uniqueCode_Mc'
    ) {
      return (
        <div className='col-4 text-secondary px-2'>
          <label htmlFor={name} className='d-flex  p-1'>
            {caption}
          </label>
          <div className='p-1'>
            <input
              id={name}
              className='form-control'
              type={type}
              {...register}
            />
            {errors.exampleRequired && <span>This field is required</span>}
          </div>
        </div>
      );
    }
    if (name === 'year') {
      setValue('year', mainData.year);
      return (
        <div className='bg-warning  text-secondary '>
          <div className='input-group'>
            <input
              id={name}
              className='w-100 form-control'
              type='hidden'
              {...register}
            />
          </div>
        </div>
      );
    }
    if (name === 'id') {
      setValue('id', 0);

      return (
        <div className='row text-secondary  '>
          <div className='input-group'>
            <input
              id={name}
              className='form-control '
              type='hidden'
              value='0'
              disabled
            />
          </div>
        </div>
      );
    }
    if (name === 'name_Mc') {
      return (
        <div className='w-100 d-flex p-3 text-secondary px-4'>
          <label htmlFor={name} className='d-flex p-1 col-2'>
            {caption}
          </label>
          <div className='input-group'>
            <input
              id={name}
              className='w-100 form-control'
              type={type}
              {...register}
            />
            {errors.exampleRequired && <span>This field is required</span>}
          </div>
        </div>
      );
    }
    if (
      name === 'duties_Mc' ||
      name === 'legalDuties_Mc' ||
      name === 'desc_Mc'
    ) {
      return (
        <div className='w-100 d-flex flex-wrap p-3 text-secondary px-4'>
          <label htmlFor={name} className='d-flex p-1 col-2'>
            {caption}
          </label>
          <div className='input-group'>
            <textarea
              name={name}
              rows='2'
              cols='50'
              id={name}
              className='w-100 form-control'
              type={type}
              {...register}
            ></textarea>
          </div>

          {errors.exampleRequired && <span>This field is required</span>}
        </div>
      );
    }

    if (name === 'isActive_') {
      setValue('isActive_', true);

      return;
    }
  }
  //////////////////////////////////////////////end add new data/////////////////////
  ////////////////////start Sub Data Add //////////////////
  if (usage === 'addSubData') {
    if (name === 'code_Parent_Mc') {
      setValue('code_Parent_Mc', singleData.code_Mc);

      return (
        <input
          id={name}
          className=' d-none form-control'
          type={'hidden'}
          defaultValue={singleData.code_Mc}
          disabled
          {...register}
        />
      );
    }

    if (name === 'level_Mc') {
      setValue('level_Mc', singleData.level_Mc + 1);

      return (
        <div className='row text-secondary  '>
          <div className='input-group'>
            <input
              id={name}
              className='w-100 form-control '
              type='hidden'
              value='0'
              disabled
            />
          </div>
        </div>
      );
    }
  }
  /////////////////// end of usage add sub data //////////////

  //////////////////////////////// start edit data /////////////////////////
  if (usage === 'editModal') {
    if (name === 'name_Mc') {
      setValue('name_Mc', singleData.name_Mc);

      return (
        <div className='w-100 d-flex p-3 text-secondary px-4'>
          <label htmlFor={name} className='d-flex p-1 col-2'>
            {caption}
          </label>
          <div className='input-group'>
            <input
              id={name}
              className='w-100 form-control'
              type={type}
              {...register}
              defaultValue={singleData.name_Mc}
            />
            {errors.exampleRequired && <span>This field is required</span>}
          </div>
        </div>
      );
    }
    if (name === 'id') {
      setValue('id', singleData.id);
      return (
        <div className='input-group'>
          <input id={name} type='hidden' {...register} />
        </div>
      );
    }
    if (name === 'year') {
      setValue('year', singleData.year);
      return (
        <div className='input-group'>
          <input id={name} type='hidden' {...register} />
        </div>
      );
    }
    if (name === 'level_Mc') {
      setValue('level_Mc', singleData.level_Mc);

      return (
        <div className='input-group'>
          <input id={name} type='hidden' {...register} />
        </div>
      );
    }
    if (name === 'isActive_') {
      return (
        <div className='d-flex align-items-center p-3 form-check text-secondary px-4'>
          <label htmlFor={name} className='form-check-label d-flex p-3 '>
            {caption}
          </label>
          <input
            id={name}
            placeholder={name}
            className='d-flex  form-check-input'
            type={'checkbox'}
            {...register}
            defaultChecked={checked}
            onChange={() => setChecked(!checked)}
          />
          {errors.exampleRequired && <span>This field is required</span>}
        </div>
      );
    }
    if (name === 'code_Parent_Mc') {
      setValue('code_Parent_Mc', singleData.code_Parent_Mc);
      return (
        <div className='input-group'>
          <input id={name} type='hidden' {...register} />
        </div>
      );
    }

    if (name === 'code_Mc') {
      setValue('code_Mc', singleData.code_Mc);

      return (
        <div className='col-4 text-secondary px-2'>
          <label htmlFor={name} className='d-flex  p-1'>
            {caption}
          </label>
          <input
            id={name}
            className='form-control'
            type={type}
            defaultValue={singleData.code_Mc}
            {...register}
          />
          {errors.exampleRequired && <span>This field is required</span>}
        </div>
      );
    }

    if (name === 'pakna_Code') {
      setValue('pakna_Code', singleData.pakna_Code);

      return (
        <div className='col-4 text-secondary px-2'>
          <label htmlFor={name} className='d-flex  p-1'>
            {caption}
          </label>
          <div className='p-1'>
            <input
              id={name}
              className='form-control'
              type={type}
              {...register}
              defaultValue={singleData.pakna_Code}
            />
            {errors.exampleRequired && <span>This field is required</span>}
          </div>
        </div>
      );
    }
    if (name === 'uniqueCode_Mc') {
      setValue('uniqueCode_Mc', singleData.uniqueCode_Mc);

      return (
        <div className='col-4 text-secondary px-2'>
          <label htmlFor={name} className='d-flex  p-1'>
            {caption}
          </label>
          <div className='p-1'>
            <input
              id={name}
              className='form-control'
              type={type}
              {...register}
              defaultValue={singleData.uniqueCode_Mc}
            />
            {errors.exampleRequired && <span>This field is required</span>}
          </div>
        </div>
      );
    }
    if (name === 'duties_Mc') {
      setValue('duties_Mc', singleData.duties_Mc);

      return (
        <div className='w-100 d-flex flex-wrap p-3 text-secondary px-4'>
          <label htmlFor={name} className='d-flex p-1 col-2'>
            {caption}
          </label>
          <div className='input-group'>
            <textarea
              name={name}
              rows='2'
              cols='50'
              id={name}
              className='w-100 form-control'
              type={type}
              defaultValue={singleData.duties_Mc}
              {...register}
            ></textarea>
          </div>

          {errors.exampleRequired && <span>This field is required</span>}
        </div>
      );
    }
    if (name === 'legalDuties_Mc') {
      setValue('legalDuties_Mc', singleData.legalDuties_Mc);

      return (
        <div className='w-100 d-flex flex-wrap p-3 text-secondary px-4'>
          <label htmlFor={name} className='d-flex p-1 col-2'>
            {caption}
          </label>
          <div className='input-group'>
            <textarea
              name={name}
              rows='2'
              cols='50'
              id={name}
              className='w-100 form-control'
              type={type}
              defaultValue={singleData.legalDuties_Mc}
              {...register}
            ></textarea>
          </div>

          {errors.exampleRequired && <span>This field is required</span>}
        </div>
      );
    }
    if (name === 'desc_Mc') {
      setValue('desc_Mc', singleData.desc_Mc);
      return (
        <div className='w-100 d-flex flex-wrap p-3 text-secondary px-4'>
          <label htmlFor={name} className='d-flex p-1 col-2'>
            {caption}
          </label>
          <div className='input-group'>
            <textarea
              name={name}
              rows='2'
              cols='50'
              id={name}
              className='w-100 form-control'
              type={type}
              defaultValue={singleData.desc_Mc}
              {...register}
            ></textarea>
          </div>

          {errors.exampleRequired && <span>This field is required</span>}
        </div>
      );
    }
    return <></>;
    // Code_Mc
    // Id
    // Year
    // Level_Mc
    // IsActive_
    // Code_Parent_Mc
    // Name_Mc
    // Pakna_Code;
    // UniqueCode_Mc;
    // LegalDuties_Mc
    // Desc_Mc
  }

  // if (name === 'Code_J_JC') {
  //   return (
  //     <div className='px-4 p-3'>
  //       <label className='d-flex text-secondary' htmlFor='hiddenText'>
  //         {caption}:
  //       </label>
  //       <input type='text' className='w-0 h-0 d-flex d-none' {...register} />
  //       <select
  //         className='form-select fs-4'
  //         id='hiddenText'
  //         ///////////////////////////////////////////////////////////////
  //         onChange={(e) => {
  //           setValue('Code_J_JC', e.target.value);
  //         }}
  //       >
  //         <option className='' selected>
  //           انتخاب نمایید
  //         </option>

  //         {inputData?.map((item, index) => {
  //           return (
  //             <option
  //               className='p-2 d-flex fs-4'
  //               aria-label={'.form-select-sm example'}
  //               value={item.code_J}
  //               key={index}
  //             >
  //               {item.name_j}
  //             </option>
  //           );
  //         })}
  //       </select>
  //     </div>
  //   );
  // }

  // /////////////////////////////////////////////////////

  // if (type === 'checkbox') {
  //   return (
  //     <div className='d-flex align-items-center p-3 form-check text-secondary px-4'>
  //       <label htmlFor={name} className='form-check-label d-flex p-3 '>
  //         {caption}
  //       </label>
  //       <input
  //         id={name}
  //         placeholder={name}
  //         className='d-flex  form-check-input'
  //         type={type}
  //         {...register}
  //       />
  //       {errors.exampleRequired && <span>This field is required</span>}
  //     </div>
  //   );
  // }
  // if (name === 'Item_Jc') {
  //   return (
  //     <div className='px-4 p-3'>
  //       <label className='d-flex text-secondary' htmlFor='hiddenText'>
  //         {caption}:
  //       </label>
  //       <input type='text' className='w-0 h-0 d-flex d-none' {...register} />
  //       <select
  //         className='form-select fs-4'
  //         id='hiddenText'
  //         onChange={(e) => {
  //           setValue('Item_Jc', e.target.value);
  //         }}
  //       >
  //         <option className='' selected>
  //           انتخاب نمایید
  //         </option>

  //         {basicCodeData?.map((item, index) => {
  //           return (
  //             <option
  //               className='p-2 d-flex fs-4'
  //               aria-label={'.form-select-sm example'}
  //               value={item.code_}
  //               key={index}
  //             >
  //               {item.name_}
  //             </option>
  //           );
  //         })}
  //       </select>
  //     </div>
  //   );
  // }

  return (
    <div className='w-100 d-flex flex-wrap p-3 text-secondary px-4'>
      fsdfsd
      <label htmlFor={name} className='d-flex p-1 col-2'>
        {caption}
      </label>
      <div className='input-group'>
        <input
          name={name}
          id={name}
          className='w-100 form-control'
          type={type}
          {...register}
        />
      </div>
      {errors.exampleRequired && <span>This field is required</span>}
    </div>
  );
};
export default InputForm;
