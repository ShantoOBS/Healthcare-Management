import { Prisma, Specialty } from "../../../generated/prisma/client.js";
import { IQueryParams } from "../../interfaces/query.interface.js";
import { prisma } from "../../lib/prisma.js";
import { QueryBuilder } from "../../utils/QueryBuilder.js";
import { specialtyFilterableFields, specialtySearchableFields } from "./specialty.constant.js";

const createSpecialty = async (payload: Specialty): Promise<Specialty> => {
    // throw new Error("Testing error handling in create specialty service");
    const specialty = await prisma.specialty.create({
        data: payload
    })

    return specialty;
}

const getAllSpecialties = async (query: IQueryParams) => {
    const queryBuilder = new QueryBuilder<Specialty, Prisma.SpecialtyWhereInput, Prisma.SpecialtyInclude>(
        prisma.specialty,
        query,
        {
            searchableFields: specialtySearchableFields,
            filterableFields: specialtyFilterableFields,
        }
    );

    return queryBuilder
        .search()
        .filter()
        .where({ isDeleted: false })
        .paginate()
        .sort()
        .execute();
}

const deleteSpecialty = async (id: string): Promise<Specialty> => {
    const specialty = await prisma.specialty.delete({
        where: { id }
    })

    return specialty;
}

export const SpecialtyService = {
    createSpecialty,
    getAllSpecialties,
    deleteSpecialty
}